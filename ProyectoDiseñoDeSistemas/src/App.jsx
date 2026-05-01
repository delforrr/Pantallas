import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Typography, Fade } from '@mui/material';
import { getTheme } from './context/theme';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import AppSidebar from './components/AppSidebar';
import AppHeader from './components/AppHeader';

// ── All screen imports ──────────────────────────────────────
import CatalogoScreen from './pages/screens/cliente/CatalogoScreen';
import CarritoScreen from './pages/screens/cliente/CarritoScreen';
import PedidosClienteScreen from './pages/screens/cliente/PedidosClienteScreen';
import MediosPagoScreen from './pages/screens/cliente/MediosPagoScreen';

import ClientesScreen from './pages/screens/ventas/ClientesScreen';
import PedidosScreen from './pages/screens/ventas/PedidosScreen';
import PresupuestosScreen from './pages/screens/ventas/PresupuestosScreen';
import ComprobantesVentaScreen from './pages/screens/ventas/ComprobantesVentaScreen';
import ComprobantesPagoScreen from './pages/screens/ventas/ComprobantesPagoScreen';
import CierreCajaScreen from './pages/screens/ventas/CierreCajaScreen';

import OrdenProduccionScreen from './pages/screens/produccion/OrdenProduccionScreen';
import RecetasScreen from './pages/screens/produccion/RecetasScreen';
import ProductosCompuestosScreen from './pages/screens/produccion/ProductosCompuestosScreen';
import MateriaPrimaScreen from './pages/screens/produccion/MateriaPrimaScreen';
import StockScreen from './pages/screens/produccion/StockScreen';

import ProveedoresScreen from './pages/screens/compras/ProveedoresScreen';
import OrdenCompraScreen from './pages/screens/compras/OrdenCompraScreen';
import PresupuestoProveedorScreen from './pages/screens/compras/PresupuestoProveedorScreen';
import FacturasRemitosScreen from './pages/screens/compras/FacturasRemitosScreen';

import MaquinariaScreen from './pages/screens/mantenimiento/MaquinariaScreen';
import OrdenesMantScreen from './pages/screens/mantenimiento/OrdenesMantScreen';
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
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
            {label}
          </Typography>
          <Box sx={{ width: 40, height: 3, background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`, borderRadius: 2, mt: 0.8 }} />
        </Box>
        {Screen ? <Screen /> : (
          <Box sx={{ color: 'text.disabled', mt: 6, textAlign: 'center' }}>
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
  const { user, themeMode } = useApp();
  const theme = React.useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? <AppLayout /> : <LoginPage />}
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRoot />
    </AppProvider>
  );
}
