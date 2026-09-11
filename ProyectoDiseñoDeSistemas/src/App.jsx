import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Typography, Fade } from '@mui/material';
import { getTheme } from './theme';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import { AppLayout } from './components/layout';

// ── All screen imports ──────────────────────────────────────
import CatalogoScreen from './pages/cliente/CatalogoScreen';
import CarritoScreen from './pages/cliente/CarritoScreen';
import PedidosClienteScreen from './pages/cliente/PedidosClienteScreen';
import MediosPagoScreen from './pages/cliente/MediosPagoScreen';

import ClientesScreen from './pages/ventas/ClientesScreen';
import PedidosScreen from './pages/ventas/PedidosScreen';
import PresupuestosScreen from './pages/ventas/PresupuestosScreen';
import ComprobantesVentaScreen from './pages/ventas/ComprobantesVentaScreen';
import ComprobantesPagoScreen from './pages/ventas/ComprobantesPagoScreen';
import CierreCajaScreen from './pages/ventas/CierreCajaScreen';

import OrdenProduccionScreen from './pages/produccion/OrdenProduccionScreen';
import RecetasScreen from './pages/produccion/RecetasScreen';
import ProductosCompuestosScreen from './pages/produccion/ProductosCompuestosScreen';
import MateriaPrimaScreen from './pages/produccion/MateriaPrimaScreen';
import StockScreen from './pages/produccion/StockScreen';

import ProveedoresScreen from './pages/compras/ProveedoresScreen';
import OrdenCompraScreen from './pages/compras/OrdenCompraScreen';
import PresupuestoProveedorScreen from './pages/compras/PresupuestoProveedorScreen';
import FacturasRemitosScreen from './pages/compras/FacturasRemitosScreen';

import MaquinariaScreen from './pages/mantenimiento/MaquinariaScreen';
import OrdenesMantScreen from './pages/mantenimiento/OrdenesMantScreen';
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

// ── Root: switches between login and layout ─────────────────
const AppRoot = () => {
  const { user, themeMode } = useApp();
  const theme = React.useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <AppLayout>
          <PageContent />
        </AppLayout>
      ) : (
        <LoginPage />
      )}
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
