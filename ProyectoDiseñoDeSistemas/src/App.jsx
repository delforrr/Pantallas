import CatalogoAdmin from './pages/administracion/CatalogoScreen';
import DashboardScreen from './pages/administracion/DashboardScreen';
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Typography, Fade, GlobalStyles } from '@mui/material';
import { getTheme } from './theme';
import { AppProvider, useApp } from './context/AppContext';
import AdminLoginPage from './pages/LoginPage';
import { AppLayout } from './components/layout';
import ClientePortalLayout from './components/cliente/ClientePortalLayout';
import ClienteAccesoScreen from './pages/cliente/ClienteAccesoScreen';
import MayoristasTienda from './components/cliente/MayoristasTienda';
import { ModuleSurface } from './components/shared/ModuleUI';

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
  dashboard: DashboardScreen,
  admin_estados: () => <CatalogoAdmin tipo="estados" entidad="estado" soloNombre />,
  admin_iva: () => <CatalogoAdmin tipo="iva" entidad="tipo de IVA" />,
  admin_empleados: () => <CatalogoAdmin tipo="empleados" entidad="empleado" />,
  admin_provincias: () => <CatalogoAdmin tipo="provincias" entidad="provincia" />,
  admin_localidades: () => <CatalogoAdmin tipo="localidades" entidad="localidad" padre="provincias" etiquetaPadre="Provincia" />,
  admin_calles: () => <CatalogoAdmin tipo="calles" entidad="calle" padre="localidades" etiquetaPadre="Localidad" />,
  admin_unidades: () => <CatalogoAdmin tipo="unidades" entidad="unidad de medida" />,
  admin_tipos_materia: () => <CatalogoAdmin tipo="tiposMateriaPrima" entidad="tipo de materia prima" />,
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
        {!isCliente && currentPage !== 'dashboard' && <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
            {label}
          </Typography>
          <Box sx={{ width: 40, height: 3, background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`, borderRadius: 2, mt: 0.8 }} />
        </Box>}
        {Screen ? (
          !isCliente ? (
            <ModuleSurface>
              <Screen />
            </ModuleSurface>
          ) : (
            <Screen />
          )
        ) : (
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
  const accesoAdmin = currentPage === 'admin_login' || (user?.role !== 'admin' && Boolean(currentPage) && !['catalogo', 'carrito', 'pedidos_cliente', 'medios_pago', 'mi_perfil', 'ingresar', 'registrarse'].includes(currentPage));
  const paginaPortalCliente = ['catalogo', 'carrito', 'pedidos_cliente', 'medios_pago', 'mi_perfil'].includes(currentPage);
  const accesoCliente = ['ingresar', 'registrarse'].includes(currentPage) || (user?.role !== 'cliente' && ['carrito', 'pedidos_cliente', 'medios_pago', 'mi_perfil'].includes(currentPage));
  const theme = React.useMemo(() => getTheme(user?.role === 'cliente' ? 'light' : themeMode), [themeMode, user?.role]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!accesoCliente && !paginaPortalCliente && (
        <GlobalStyles
          styles={(t) => ({
            '.MuiButton-root': {
              minHeight: 44,
            },
            '.MuiButton-contained.MuiButton-colorPrimary': {
              backgroundColor: (t.palette.mode === 'dark' ? t.palette.primary.main : t.palette.primary.dark) + ' !important',
              color: (t.palette.mode === 'dark' ? t.palette.common.black : t.palette.common.white) + ' !important',
              '&:hover': {
                backgroundColor: (t.palette.mode === 'dark' ? t.palette.primary.light : t.palette.primary.dark) + ' !important',
              },
            },
            '.MuiButton-outlined.MuiButton-colorPrimary, .MuiButton-text.MuiButton-colorPrimary': {
              color: (t.palette.mode === 'dark' ? t.palette.primary.light : t.palette.primary.dark) + ' !important',
            },
            '.MuiButton-contained.MuiButton-colorError': {
              backgroundColor: t.palette.error.dark + ' !important',
              color: t.palette.common.white + ' !important',
            },
            '.MuiTableCell-root .MuiIconButton-root:not(.MuiTablePagination-root .MuiIconButton-root)': {
              border: `1px solid ${t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'}`,
              borderRadius: '8px',
              minWidth: 38,
              minHeight: 38,
              margin: '2px',
              transition: 'all 0.15s ease-in-out',
              '&:hover': {
                backgroundColor: t.palette.action.hover,
                borderColor: t.palette.text.secondary,
              },
            },
            '.MuiInputBase-root:not(.MuiTablePagination-root .MuiInputBase-root)': {
              minHeight: 44,
            },
            '.MuiDialog-paper': {
              borderRadius: '16px !important',
            },
          })}
        />
      )}
      {accesoAdmin ? <AdminLoginPage /> : !user || user.role === 'cliente' || accesoCliente || paginaPortalCliente ? (
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
