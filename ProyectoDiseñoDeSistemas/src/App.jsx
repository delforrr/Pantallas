import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Typography, Fade, GlobalStyles } from '@mui/material';
import { getTheme } from './theme';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import { AppLayout } from './components/layout';
import ClientePortalLayout from './components/cliente/ClientePortalLayout';
import ClienteAccesoScreen from './pages/cliente/ClienteAccesoScreen';
import MayoristasTienda from './components/cliente/MayoristasTienda';

// ── All screen imports ──────────────────────────────────────
import CatalogoScreen from './pages/cliente/CatalogoScreen';
import CarritoScreen from './pages/cliente/CarritoScreen';
import PedidosClienteScreen from './pages/cliente/PedidosClienteScreen';
import MediosPagoScreen from './pages/cliente/MediosPagoScreen';
import PerfilClienteScreen from './pages/cliente/PerfilClienteScreen';

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

import ProveedoresScreen from './pages/compras/ProveedoresScreen';
import OrdenCompraScreen from './pages/compras/OrdenCompraScreen';
import PresupuestoProveedorScreen from './pages/compras/PresupuestoProveedorScreen';
import FacturasRemitosScreen from './pages/compras/FacturasRemitosScreen';

import MaquinariaScreen from './pages/mantenimiento/MaquinariaScreen';
import OrdenesMantScreen from './pages/mantenimiento/OrdenesMantScreen';
import { PAGE_LABELS } from './config/navigation';

const PedidosTienda = () => <><MayoristasTienda /><PedidosScreen /></>;

const SCREEN_MAP = {
  catalogo: CatalogoScreen,
  carrito: CarritoScreen,
  pedidos_cliente: PedidosClienteScreen,
  medios_pago: MediosPagoScreen,
  mi_perfil: PerfilClienteScreen,
  clientes: ClientesScreen,
  pedidos: PedidosTienda,
  presupuestos: PresupuestosScreen,
  comprobantes_venta: ComprobantesVentaScreen,
  comprobantes_pago: ComprobantesPagoScreen,
  cierre_caja: CierreCajaScreen,
  orden_produccion: OrdenProduccionScreen,
  recetas: RecetasScreen,
  productos_compuestos: ProductosCompuestosScreen,
  materia_prima: MateriaPrimaScreen,
  proveedores: ProveedoresScreen,
  orden_compra: OrdenCompraScreen,
  presupuesto_proveedor: PresupuestoProveedorScreen,
  facturas_remitos: FacturasRemitosScreen,
  maquinaria: MaquinariaScreen,
  ordenes_mantenimiento: OrdenesMantScreen,
};

// ── Page wrapper with fade animation ───────────────────────
const PageContent = () => {
  const { currentPage, user } = useApp();
  const paginaCliente = ['catalogo', 'carrito', 'pedidos_cliente', 'medios_pago', 'mi_perfil'].includes(currentPage);
  const Screen = !user || (user.role === 'cliente' && !paginaCliente) ? CatalogoScreen : SCREEN_MAP[currentPage || 'catalogo'];
  const label = PAGE_LABELS[currentPage] || 'Dashboard';
  const isCliente = !user || user?.role === 'cliente' || ['catalogo', 'carrito', 'pedidos_cliente', 'medios_pago', 'mi_perfil'].includes(currentPage);

  return (
    <Fade in key={currentPage} timeout={300}>
      <Box sx={{ flex: 1, p: isCliente ? 0 : { xs: 1.5, sm: 2.5, md: 3 }, overflowY: 'auto', minWidth: 0, width: '100%', maxWidth: '100%', height: isCliente ? '100%' : 'auto', display: isCliente ? 'flex' : 'block', flexDirection: isCliente ? 'column' : 'initial' }}>
        {isCliente && (
          <GlobalStyles styles={{ '#notifications-btn': { display: 'none !important' } }} />
        )}
        {/* Page header */}
        {!isCliente && <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
            {label}
          </Typography>
          <Box sx={{ width: 40, height: 3, background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`, borderRadius: 2, mt: 0.8 }} />
        </Box>}
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
  const { user, currentPage, themeMode, sidebarOpen, toggleSidebar } = useApp();
  const portalPublico = !user && currentPage !== 'admin_login';
  const accesoCliente = !user && ['carrito', 'pedidos_cliente', 'medios_pago', 'mi_perfil', 'ingresar', 'registrarse'].includes(currentPage);
  const theme = React.useMemo(() => getTheme(user?.role === 'cliente' ? 'light' : themeMode), [themeMode, user?.role]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user || portalPublico ? !user || user.role === 'cliente' ? (
        <ClientePortalLayout>{accesoCliente ? <ClienteAccesoScreen key={currentPage} /> : <PageContent />}</ClientePortalLayout>
      ) : (
        <>
          {sidebarOpen && (
            <Box
              id="sidebar-backdrop"
              onClick={toggleSidebar}
              sx={{
                position: 'fixed',
                inset: 0,
                bgcolor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(2px)',
                zIndex: 1250,
                cursor: 'pointer',
              }}
            />
          )}
          <AppLayout>
            <PageContent />
          </AppLayout>
        </>
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
