import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Typography, Fade } from '@mui/material';
import theme from './theme';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import AppSidebar from './components/AppSidebar';
import AppHeader from './components/AppHeader';

// ── All screen imports ──────────────────────────────────────
import {
  CatalogoScreen, CarritoScreen, PedidosClienteScreen, MediosPagoScreen,
  ClientesScreen, PedidosScreen, PresupuestosScreen,
  ComprobantesVentaScreen, ComprobantesPagoScreen, CierreCajaScreen,
  OrdenProduccionScreen, RecetasScreen, ProductosCompuestosScreen,
  MateriaPrimaScreen, StockScreen,
  ProveedoresScreen, OrdenCompraScreen, PresupuestoProveedorScreen, FacturasRemitosScreen,
  MaquinariaScreen, OrdenesMantScreen,
} from './pages/screens';
import { PAGE_LABELS } from './config/navigation';

const SCREEN_MAP = {
  catalogo: CatalogoScreen,
  carrito: CarritoScreen,
  pedidos_cliente: PedidosClienteScreen,
  medios_pago: MediosPagoScreen,
  clientes: ClientesScreen,
  pedidos: PedidosScreen,
  presupuestos: PresupuestosScreen,
  comprobantes_venta: ComprobantesVentaScreen,
  comprobantes_pago: ComprobantesPagoScreen,
  cierre_caja: CierreCajaScreen,
  orden_produccion: OrdenProduccionScreen,
  recetas: RecetasScreen,
  productos_compuestos: ProductosCompuestosScreen,
  materia_prima: MateriaPrimaScreen,
  stock: StockScreen,
  proveedores: ProveedoresScreen,
  orden_compra: OrdenCompraScreen,
  presupuesto_proveedor: PresupuestoProveedorScreen,
  facturas_remitos: FacturasRemitosScreen,
  maquinaria: MaquinariaScreen,
  ordenes_mantenimiento: OrdenesMantScreen,
};

// ── Page wrapper with fade animation ───────────────────────
const PageContent = () => {
  const { currentPage } = useApp();
  const Screen = SCREEN_MAP[currentPage];
  const label = PAGE_LABELS[currentPage] || 'Dashboard';

  return (
    <Fade in key={currentPage} timeout={300}>
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, overflowY: 'auto' }}>
        {/* Page header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F5ECD7', letterSpacing: '-0.01em' }}>
            {label}
          </Typography>
          <Box sx={{ width: 40, height: 3, background: 'linear-gradient(90deg, #E8A020, transparent)', borderRadius: 2, mt: 0.8 }} />
        </Box>
        {Screen ? <Screen /> : (
          <Box sx={{ color: '#6B5F44', mt: 6, textAlign: 'center' }}>
            <Typography variant="h6">Seleccioná una sección del menú</Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

// ── Authenticated layout ────────────────────────────────────
const AppLayout = () => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <AppSidebar />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <AppHeader />
      <PageContent />
    </Box>
  </Box>
);

// ── Root: switches between login and layout ─────────────────
const AppRoot = () => {
  const { user } = useApp();
  return user ? <AppLayout /> : <LoginPage />;
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppRoot />
      </AppProvider>
    </ThemeProvider>
  );
}
