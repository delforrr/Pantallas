// Navigation config for each role
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import GrassIcon from '@mui/icons-material/Grass';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DescriptionIcon from '@mui/icons-material/Description';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import EngineeringIcon from '@mui/icons-material/Engineering';

export const PAGE_LABELS = {
  // Cliente
  catalogo: 'Catálogo de Productos',
  carrito: 'Mi Carrito',
  pedidos_cliente: 'Mis Pedidos',
  medios_pago: 'Medios de Pago',

  // Ventas
  clientes: 'Administrar Clientes',
  pedidos: 'Pedidos',
  presupuestos: 'Presupuestos',
  comprobantes_venta: 'Comprobantes de Venta',
  comprobantes_pago: 'Comprobantes de Pago',
  cierre_caja: 'Cierre de Caja',

  // Producción
  orden_produccion: 'Orden de Producción',
  recetas: 'Recetas',
  productos_compuestos: 'Productos',
  materia_prima: 'Materia Prima',
  stock: 'Stock',

  // Compras
  proveedores: 'Proveedores',
  orden_compra: 'Orden de Compra',
  presupuesto_proveedor: 'Presupuesto Proveedor',
  facturas_remitos: 'Facturas / Remitos',

  // Mantenimiento
  maquinaria: 'Maquinaria',
  ordenes_mantenimiento: 'Órdenes de Mantenimiento',
};

export const CLIENT_NAV = [
  { id: 'catalogo', label: 'Inicio / Catálogo', icon: HomeIcon },
  { id: 'carrito', label: 'Mi Carrito', icon: ShoppingCartIcon },
  { id: 'pedidos_cliente', label: 'Mis Pedidos', icon: ReceiptLongIcon },
  { id: 'medios_pago', label: 'Medios de Pago', icon: PaymentIcon },
];

export const ADMIN_NAV = [
  {
    id: 'ventas',
    label: 'Ventas',
    icon: PointOfSaleIcon,
    children: [
      { id: 'clientes', label: 'Administrar Clientes', icon: PeopleIcon },
      { id: 'pedidos', label: 'Pedidos', icon: LocalShippingIcon },
      { id: 'presupuestos', label: 'Presupuestos', icon: RequestQuoteIcon },
      { id: 'comprobantes_venta', label: 'Comp. de Venta', icon: DescriptionIcon },
      { id: 'comprobantes_pago', label: 'Comp. de Pago', icon: AccountBalanceWalletIcon },
      { id: 'cierre_caja', label: 'Cierre de Caja', icon: AccountBalanceWalletIcon },
    ],
  },
  {
    id: 'produccion',
    label: 'Producción',
    icon: PrecisionManufacturingIcon,
    children: [
      { id: 'orden_produccion', label: 'Orden de Producción', icon: AssignmentIcon },
      { id: 'recetas', label: 'Recetas', icon: MenuBookIcon },
      { id: 'productos_compuestos', label: 'Productos', icon: CategoryIcon },
      { id: 'materia_prima', label: 'Materia Prima', icon: GrassIcon },
      { id: 'stock', label: 'Stock', icon: InventoryIcon },
    ],
  },
  {
    id: 'compras',
    label: 'Compras',
    icon: ShoppingBagIcon,
    children: [
      { id: 'proveedores', label: 'Proveedores', icon: StorefrontIcon },
      { id: 'orden_compra', label: 'Orden de Compra', icon: ShoppingCartIcon },
      { id: 'presupuesto_proveedor', label: 'Presupuesto Proveedor', icon: RequestQuoteIcon },
      { id: 'facturas_remitos', label: 'Facturas / Remitos', icon: ReceiptLongIcon },
    ],
  },
  {
    id: 'mantenimiento',
    label: 'Mantenimiento',
    icon: EngineeringIcon,
    children: [
      { id: 'maquinaria', label: 'Maquinaria', icon: BuildCircleIcon },
      { id: 'ordenes_mantenimiento', label: 'Órdenes de Mantenimiento', icon: AssignmentIcon },
    ],
  },
];
