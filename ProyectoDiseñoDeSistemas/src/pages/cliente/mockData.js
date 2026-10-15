import { useSyncExternalStore } from 'react';

/**
 * mockData.js - Portal Cliente (PastaFab ERP)
 * Gestión de datos en memoria para el autoservicio de clientes:
 * - Catálogo de productos: Pastas simples, rellenas, gourmet y salsas por separado.
 * - Tipos de pedido: Venta Mostrador, Fijo Semanal (con descuento), Evento Especial 48hs (seña 50%).
 * - Medios de pago autorizados: Efectivo, Débito, Mercado Pago, Cuenta DNI, Cuenta Corriente.
 * - Políticas de cancelación y canje de calidad sin costo ($0).
 */

export const CATEGORIAS_PRODUCTOS = [
  'Todos',
  'Pastas Frescas',
  'Pastas Rellenas',
  'Pastas Gourmet',
  'Salsas Caseras',
  'Packs y Combos',
];

export const PRODUCT_IMAGES = {
  100: new URL('../../components/cliente/productos/penne.webp', import.meta.url).href,
  101: new URL('../../components/cliente/productos/sorrentinos.webp', import.meta.url).href,
  102: new URL('../../components/cliente/productos/ravioles.webp', import.meta.url).href,
  103: new URL('../../components/cliente/productos/tallarines.webp', import.meta.url).href,
  104: new URL('../../components/cliente/productos/noquis.webp', import.meta.url).href,
  105: new URL('../../components/cliente/productos/panzotti.webp', import.meta.url).href,
  106: new URL('../../components/cliente/productos/capeletis.webp', import.meta.url).href,
  201: new URL('../../components/cliente/productos/tuco.webp', import.meta.url).href,
  202: new URL('../../components/cliente/productos/bolognesa.webp', import.meta.url).href,
  203: new URL('../../components/cliente/productos/cuatro-quesos.webp', import.meta.url).href,
  204: new URL('../../components/cliente/productos/pesto.webp', import.meta.url).href,
  301: new URL('../../components/cliente/productos/pack-familiar.webp', import.meta.url).href,
  302: new URL('../../components/cliente/productos/combo-eventos.webp', import.meta.url).href,
};

export const MINIMO_MAYORISTA = 10;
export const DIAS_ENTREGA_SEMANAL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const calcularPresupuestoMayorista = (cantidades) => {
  const items = Object.entries(cantidades).map(([id, cantidad]) => {
    const producto = CATALOGO_CLIENTE.find((p) => p.idProducto === Number(id));
    if (!producto || !Number.isInteger(cantidad) || cantidad < MINIMO_MAYORISTA || cantidad > producto.stock) return null;
    return { idProducto: producto.idProducto, nombre: producto.nombre, cantidad, unidad: producto.unidad, precioUnitario: producto.precio, subtotal: producto.precio * cantidad };
  });
  const valido = items.length > 0 && items.every(Boolean);
  const subtotal = valido ? items.reduce((total, item) => total + item.subtotal, 0) : 0;
  const descuento = Math.round(subtotal * 0.1);
  return { items: valido ? items : [], valido, subtotal, descuento, total: subtotal - descuento };
};

export const CATALOGO_CLIENTE = [
  {
    idProducto: 100,
    nombre: 'Penne Rigate Tradizionale (Kg)',
    categoria: 'Pastas Frescas',
    variedad: 'Trefilado al bronce con 100% sémola candeal, tomates cherry confitados y finas hierbas',
    precio: 3400,
    unidad: 'Kg',
    stock: 50,
    destacado: true,
    imagen: PRODUCT_IMAGES[100],
    maridajeSugerido: 'Tomates cherry dulces, albahaca fresca y aceite de oliva virgen extra',
  },
  {
    idProducto: 101,
    nombre: 'Sorrentinos Jamón y Queso (Caja 1kg)',
    categoria: 'Pastas Rellenas',
    variedad: 'Jamón cocido natural seleccionado y mozzarella de campo',
    precio: 4500,
    unidad: 'Caja 1kg',
    rinde: '2 a 3 porciones',
    tiempoCoccion: '8 - 10 min',
    stock: 45,
    destacado: true,
    imagen: PRODUCT_IMAGES[101],
    maridajeSugerido: 'Salsa Tuco Casero o Cuatro Quesos',
  },
  {
    idProducto: 102,
    nombre: 'Ravioles de Espinaca y Ricotta (Caja 1kg)',
    categoria: 'Pastas Rellenas',
    variedad: 'Espinaca fresca de huerta local y ricotta cremosa',
    precio: 4000,
    unidad: 'Caja 1kg',
    rinde: '2 a 3 porciones',
    tiempoCoccion: '6 - 8 min',
    stock: 60,
    destacado: true,
    imagen: PRODUCT_IMAGES[102],
    maridajeSugerido: 'Salsa Bolognesa o Filetto',
  },
  {
    idProducto: 103,
    nombre: 'Fideos Tallarines al Huevo (Kg)',
    categoria: 'Pastas Frescas',
    variedad: 'Amasado tradicional con 6 huevos por kilo y sémola candeal',
    precio: 3200,
    unidad: 'Kg',
    rinde: '3 porciones',
    tiempoCoccion: '4 - 5 min',
    stock: 80,
    destacado: false,
    imagen: PRODUCT_IMAGES[103],
    maridajeSugerido: 'Pesto Genovés o Bolognesa',
  },
  {
    idProducto: 104,
    nombre: 'Ñoquis de Papa Artesanales (Kg)',
    categoria: 'Pastas Frescas',
    variedad: 'Papa seleccionada cocida al vapor, masa suave y aireada',
    precio: 3600,
    unidad: 'Kg',
    rinde: '3 porciones',
    tiempoCoccion: '2 - 3 min (hasta que floten)',
    stock: 50,
    destacado: true,
    imagen: PRODUCT_IMAGES[104],
    maridajeSugerido: 'Tuco Casero o Estofado',
  },
  {
    idProducto: 105,
    nombre: 'Panzotti de Cordero al Malbec (Caja 1kg)',
    categoria: 'Pastas Gourmet',
    variedad: 'Cordero braseado 6 horas en reducción de vino Malbec',
    precio: 5800,
    unidad: 'Caja 1kg',
    rinde: '2 a 3 porciones',
    tiempoCoccion: '8 - 10 min',
    stock: 25,
    destacado: true,
    imagen: PRODUCT_IMAGES[105],
    maridajeSugerido: 'Manteca de salvia y nueces o fondo de cocción',
  },
  {
    idProducto: 106,
    nombre: 'Capeletis de Pollo de Campo (Caja 1kg)',
    categoria: 'Pastas Rellenas',
    variedad: 'Pechuga de pollo pastoril salteada con verdeo y especias suaves',
    precio: 4200,
    unidad: 'Caja 1kg',
    rinde: '2 a 3 porciones',
    tiempoCoccion: '7 - 9 min',
    stock: 35,
    destacado: false,
    imagen: PRODUCT_IMAGES[106],
    maridajeSugerido: 'Crema de verdeo o caldo casero',
  },
  {
    idProducto: 201,
    nombre: 'Salsa Tuco Casero Especial (Pote 500cc)',
    categoria: 'Salsas Caseras',
    variedad: 'Tomates perita maduros, laurel criollo, zanahoria y orégano fresco',
    precio: 2500,
    unidad: 'Pote 500cc',
    rinde: '2 a 3 platos abundantes',
    tiempoCoccion: 'Lista para calentar',
    stock: 40,
    destacado: true,
    imagen: PRODUCT_IMAGES[201],
    maridajeSugerido: 'Ideal para ñoquis, fideos y ravioles',
  },
  {
    idProducto: 202,
    nombre: 'Salsa Bolognesa Tradicional (Pote 500cc)',
    categoria: 'Salsas Caseras',
    variedad: 'Carne vacuna seleccionada magra, sofrito de cebolla, apio y tomate',
    precio: 2800,
    unidad: 'Pote 500cc',
    rinde: '2 a 3 platos abundantes',
    tiempoCoccion: 'Lista para calentar',
    stock: 35,
    destacado: false,
    imagen: PRODUCT_IMAGES[202],
    maridajeSugerido: 'Pastas secas y rellenas',
  },
  {
    idProducto: 203,
    nombre: 'Salsa Cuatro Quesos Cremosa (Pote 500cc)',
    categoria: 'Salsas Caseras',
    variedad: 'Mozzarella, parmesano reggiano, fontina y un toque de queso azul',
    precio: 3400,
    unidad: 'Pote 500cc',
    rinde: '2 a 3 platos abundantes',
    tiempoCoccion: 'Lista para calentar a fuego bajo',
    stock: 30,
    destacado: false,
    imagen: PRODUCT_IMAGES[203],
    maridajeSugerido: 'Sorrentinos y panzottis',
  },
  {
    idProducto: 204,
    nombre: 'Salsa Pesto a la Genovesa (Pote 250cc)',
    categoria: 'Salsas Caseras',
    variedad: 'Albahaca fresca cosechada en el día, nueces, oliva virgen extra y parmesano',
    precio: 3100,
    unidad: 'Pote 250cc',
    rinde: '3 a 4 platos',
    tiempoCoccion: 'Listo para servir a temperatura ambiente',
    stock: 20,
    destacado: false,
    imagen: PRODUCT_IMAGES[204],
    maridajeSugerido: 'Tallarines o fusillis al dente',
  },
  {
    idProducto: 301,
    nombre: 'Pack Familiar Pasta & Salsas (2kg + 2 Salsas)',
    categoria: 'Packs y Combos',
    variedad: '1kg Sorrentinos Jamón/Queso + 1kg Tallarines + 1 Tuco 500cc + 1 Cuatro Quesos 500cc',
    precio: 12500,
    unidad: 'Pack Promocional',
    rinde: '5 a 6 personas',
    tiempoCoccion: '8 - 10 min',
    stock: 15,
    destacado: true,
    imagen: PRODUCT_IMAGES[301],
    maridajeSugerido: 'Almuerzo familiar completo',
  },
  {
    idProducto: 302,
    nombre: 'Combo Degustación Eventos (5kg Surtido)',
    categoria: 'Packs y Combos',
    variedad: '2kg Sorrentinos + 2kg Panzotti Cordero + 1kg Ravioles + 3 Salsas artesanales a elección',
    precio: 26000,
    unidad: 'Caja Evento',
    rinde: '12 a 15 personas',
    tiempoCoccion: 'Varios',
    stock: 10,
    destacado: false,
    imagen: PRODUCT_IMAGES[302],
    maridajeSugerido: 'Cenas, celebraciones y reuniones empresariales',
  },
];

export const INITIAL_CLIENT_PROFILE = {
  idCliente: 1,
  cuit: '30-68912455-2',
  razonSocial: 'Trattoria & Ristorante Italia Bella',
  responsable: 'María García (Chef Propietaria)',
  email: 'maria.garcia@italiabella.com.ar',
  telefono: '(02392) 43-9901',
  direccion: 'Av. Villegas 450',
  localidad: 'Trenque Lauquen',
  provincia: 'Buenos Aires',
  tipoCliente: 'Mayorista Registrado (Restaurante)',
  diaEntregaHabitual: 'Jueves',
  aceptaCredito: true,
  limiteCredito: 350000,
  creditoUsado: 120000,
  saldoDisponible: 230000,
};

export const INITIAL_MEDIOS_PAGO = [
  {
    idMedioDePago: 1,
    tipo: 'efectivo',
    nombre: 'Efectivo en Mostrador / Contra entrega',
    detalle: 'Abonás en mano al retirar o recibir, con comprobante fiscal',
    badge: 'Recomendado',
    esDefault: true,
  },
  {
    idMedioDePago: 2,
    tipo: 'debito',
    nombre: 'Tarjeta de Débito Visa',
    detalle: 'Terminada en •••• 4412 | Banco Provincia | Vto: 09/28',
    badge: 'Débito Autorizado',
    esDefault: false,
  },
  {
    idMedioDePago: 3,
    tipo: 'mercadopago',
    nombre: 'Mercado Pago (Transferencia / QR)',
    detalle: 'CVU / Alias: pastafab.ventas.mp | Acreditación inmediata',
    badge: 'Billetera Digital',
    esDefault: false,
  },
  {
    idMedioDePago: 4,
    tipo: 'cuentadni',
    nombre: 'Cuenta DNI (Banco Provincia)',
    detalle: 'DNI Titular: 28.912.455 | Beneficio promocional disponible',
    badge: 'Billetera Digital',
    esDefault: false,
  },
  {
    idMedioDePago: 5,
    tipo: 'cuentacorriente',
    nombre: 'Cuenta Corriente Comercial',
    detalle: 'Facturación mensual a 30 días | Saldo disponible: $230.000',
    badge: 'Mayorista Habilitado',
    esDefault: false,
  },
];

export const INITIAL_PEDIDOS_CLIENTE = [
  {
    idComprobantePedidoCliente: 1001,
    nroPedido: 'PED-2026-092',
    tipoPedido: 'Venta Mostrador / Local',
    fechaEmision: '2026-09-30',
    fechaEntregaEstimada: '2026-10-01 12:30',
    modalidadEntrega: 'Retiro en Fábrica',
    domicilioEntrega: 'Local Comercial (Av. San Martín 740)',
    telefonoContacto: '(02392) 43-9901',
    estadoPedido: 'En Producción',
    estadoPago: 'Pagado',
    medioPago: 'Mercado Pago',
    trackingStep: 1, // 0: Recibido, 1: En Producción, 2: Listo/Reparto, 3: Entregado
    señaExigida: 0,
    señaAbonada: 11500,
    saldoPendiente: 0,
    subtotal: 11500,
    descuento: 0,
    envio: 0,
    total: 11500,
    nroRemito: 'REM-0001-00008412',
    nroFactura: 'FC-B-0001-00004521',
    items: [
      {
        idProducto: 101,
        nombre: 'Sorrentinos Jamón y Queso (Caja 1kg)',
        cantidad: 2,
        precioUnitario: 4500,
        subtotal: 9000,
      },
      {
        idProducto: 201,
        nombre: 'Salsa Tuco Casero Especial (Pote 500cc)',
        cantidad: 1,
        precioUnitario: 2500,
        subtotal: 2500,
      },
    ],
  },
  {
    idComprobantePedidoCliente: 1002,
    nroPedido: 'PED-2026-089',
    tipoPedido: 'Evento Especial / Fiestas (48hs)',
    fechaEmision: '2026-09-28',
    fechaEntregaEstimada: '2026-10-03 20:30',
    modalidadEntrega: 'Reparto Propio Fábrica',
    domicilioEntrega: 'Av. Villegas 450 (Salón de Eventos Trattoria)',
    telefonoContacto: '(02392) 43-9901',
    estadoPedido: 'En Producción',
    estadoPago: 'Seña 50% Abonada',
    medioPago: 'Tarjeta Débito Visa',
    trackingStep: 1,
    señaExigida: 68265, // 50% anticipo reserva evento
    señaAbonada: 68265,
    saldoPendiente: 68265,
    subtotal: 151700,
    descuento: 15170, // 10% descuento volumen
    envio: 0,
    total: 136530,
    politicaCancelacion: 'Anticipación mínima 48hs. En caso de cancelación, se retiene la seña del 50% para cubrir costos de producción.',
    nroRemito: 'REM-0001-00008399 (Pendiente entrega)',
    nroFactura: 'FC-A-0001-00004508',
    items: [
      {
        idProducto: 105,
        nombre: 'Panzotti de Cordero al Malbec (Caja 1kg)',
        cantidad: 15,
        precioUnitario: 5800,
        subtotal: 87000,
      },
      {
        idProducto: 203,
        nombre: 'Salsa Cuatro Quesos Cremosa (Pote 500cc)',
        cantidad: 8,
        precioUnitario: 3400,
        subtotal: 27200,
      },
      {
        idProducto: 301,
        nombre: 'Pack Familiar Pasta & Salsas',
        cantidad: 3,
        precioUnitario: 12500,
        subtotal: 37500,
      },
    ],
  },
  {
    idComprobantePedidoCliente: 1003,
    nroPedido: 'PED-2026-085',
    tipoPedido: 'Pedido Fijo Semanal',
    fechaEmision: '2026-09-25',
    fechaEntregaEstimada: '2026-09-26 10:00',
    modalidadEntrega: 'Reparto Propio Fábrica',
    domicilioEntrega: 'Av. Villegas 450 (Cocina Restaurante)',
    telefonoContacto: '(02392) 43-9901',
    estadoPedido: 'Entregado',
    estadoPago: 'Pagado',
    medioPago: 'Cuenta Corriente',
    trackingStep: 3,
    señaExigida: 0,
    señaAbonada: 67320,
    saldoPendiente: 0,
    subtotal: 74800,
    descuento: 7480, // 10% acuerdo semanal
    envio: 0,
    total: 67320,
    nroRemito: 'REM-0001-00008370',
    nroFactura: 'FC-A-0001-00004490',
    items: [
      {
        idProducto: 103,
        nombre: 'Fideos Tallarines al Huevo (Kg)',
        cantidad: 10,
        precioUnitario: 3200,
        subtotal: 32000,
      },
      {
        idProducto: 104,
        nombre: 'Ñoquis de Papa Artesanales (Kg)',
        cantidad: 8,
        precioUnitario: 3600,
        subtotal: 28800,
      },
      {
        idProducto: 202,
        nombre: 'Salsa Bolognesa Tradicional (Pote 500cc)',
        cantidad: 5,
        precioUnitario: 2800,
        subtotal: 14000,
      },
    ],
  },
  {
    idComprobantePedidoCliente: 1004,
    nroPedido: 'PED-2026-074',
    tipoPedido: 'Evento Especial / Fiestas (48hs)',
    fechaEmision: '2026-09-18',
    fechaEntregaEstimada: '2026-09-20 21:00',
    modalidadEntrega: 'Retiro en Fábrica',
    domicilioEntrega: 'Local Comercial',
    telefonoContacto: '(02392) 43-9901',
    estadoPedido: 'Cancelado',
    estadoPago: 'Seña Retenida (50%)',
    medioPago: 'Efectivo',
    trackingStep: -1,
    señaExigida: 22500,
    señaAbonada: 22500,
    saldoPendiente: 0,
    subtotal: 45000,
    descuento: 0,
    envio: 0,
    total: 45000,
    motivoCancelacion: 'Cancelación tardía informada por el cliente. De acuerdo a las condiciones de reserva de eventos, se retuvo la seña del 50% ($22.500) para cubrir costos de elaboración.',
    nroRemito: 'REM-ANULADO',
    nroFactura: 'FC-ANULADA',
    items: [
      {
        idProducto: 101,
        nombre: 'Sorrentinos Jamón y Queso (Caja 1kg)',
        cantidad: 10,
        precioUnitario: 4500,
        subtotal: 45000,
      },
    ],
  },
];

// ============================================================================
// STORE REACTIVO EN MEMORIA (React 19 native: useSyncExternalStore)
// ============================================================================

let currentStore = {
  mayoristaEntrega: { tipo: 'evento', dia: '' },
  carritoModo: 'habitual',
  catalogoModo: 'inicio',
  mayoristaItems: {},
  cart: [
    {
      idProducto: 101,
      nombre: 'Sorrentinos Jamón y Queso (Caja 1kg)',
      categoria: 'Pastas Rellenas',
      precio: 4500,
      unidad: 'Caja 1kg',
      cantidad: 2,
      subtotal: 9000,
      imagen: PRODUCT_IMAGES[101],
    },
    {
      idProducto: 201,
      nombre: 'Salsa Tuco Casero Especial (Pote 500cc)',
      categoria: 'Salsas Caseras',
      precio: 2500,
      unidad: 'Pote 500cc',
      cantidad: 1,
      subtotal: 2500,
      imagen: PRODUCT_IMAGES[201],
    },
  ],
  pedidos: INITIAL_PEDIDOS_CLIENTE,
  mediosPago: INITIAL_MEDIOS_PAGO,
  cliente: INITIAL_CLIENT_PROFILE,
};

const listeners = new Set();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const clientStore = {
  setWholesaleDelivery({ tipo, dia = '' }) {
    if (!['evento', 'semanal'].includes(tipo) || (dia && !DIAS_ENTREGA_SEMANAL.includes(dia))) return;
    currentStore = { ...currentStore, mayoristaEntrega: { tipo, dia: tipo === 'semanal' ? dia : '' } };
    emitChange();
  },

  setCarritoModo(modo) {
    if (!['habitual', 'mayorista'].includes(modo)) return;
    currentStore = { ...currentStore, carritoModo: modo };
    emitChange();
  },

  addWholesaleToCart(producto, cantidad) {
    const productoActual = CATALOGO_CLIENTE.find((p) => p.idProducto === producto.idProducto);
    const total = (currentStore.mayoristaItems[producto.idProducto] || 0) + cantidad;
    if (!productoActual || !Number.isInteger(cantidad) || cantidad < MINIMO_MAYORISTA || total > productoActual.stock) return false;
    currentStore = { ...currentStore, carritoModo: 'mayorista', mayoristaItems: { ...currentStore.mayoristaItems, [producto.idProducto]: total } };
    emitChange();
    return true;
  },

  setCatalogoModo(modo) {
    if (!['inicio', 'productos', 'mayorista'].includes(modo)) return;
    currentStore = { ...currentStore, catalogoModo: modo };
    emitChange();
  },

  getState() {
    return currentStore;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // ── Acciones de Carrito ──────────────────────────────────────────────────
  addToCart(producto, cantidad = 1) {
    const existing = currentStore.cart.find((i) => i.idProducto === producto.idProducto);
    let newCart;
    if (existing) {
      newCart = currentStore.cart.map((i) =>
        i.idProducto === producto.idProducto
          ? {
              ...i,
              cantidad: i.cantidad + cantidad,
              subtotal: (i.cantidad + cantidad) * i.precio,
            }
          : i
      );
    } else {
      newCart = [
        ...currentStore.cart,
        {
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          categoria: producto.categoria,
          precio: producto.precio,
          unidad: producto.unidad,
          cantidad,
          subtotal: producto.precio * cantidad,
          imagen: producto.imagen,
        },
      ];
    }
    currentStore = { ...currentStore, cart: newCart, carritoModo: 'habitual' };
    emitChange();
  },

  updateCartQuantity(idProducto, cantidad) {
    if (cantidad <= 0) {
      this.removeFromCart(idProducto);
      return;
    }
    const newCart = currentStore.cart.map((i) =>
      i.idProducto === idProducto
        ? { ...i, cantidad, subtotal: cantidad * i.precio }
        : i
    );
    currentStore = { ...currentStore, cart: newCart };
    emitChange();
  },

  removeFromCart(idProducto) {
    const newCart = currentStore.cart.filter((i) => i.idProducto !== idProducto);
    currentStore = { ...currentStore, cart: newCart };
    emitChange();
  },

  clearCart() {
    currentStore = { ...currentStore, cart: [] };
    emitChange();
  },

  // ── Acciones de Pedidos ──────────────────────────────────────────────────
  setWholesaleQuantity(idProducto, cantidad) {
    const producto = CATALOGO_CLIENTE.find((p) => p.idProducto === idProducto);
    if (!producto || !Number.isInteger(cantidad) || (cantidad !== 0 && (cantidad < MINIMO_MAYORISTA || cantidad > producto.stock))) return;
    const mayoristaItems = { ...currentStore.mayoristaItems };
    if (cantidad === 0) delete mayoristaItems[idProducto];
    else mayoristaItems[idProducto] = cantidad;
    currentStore = { ...currentStore, mayoristaItems };
    emitChange();
  },

  createWholesaleOrder() {
    const { tipo, dia } = currentStore.mayoristaEntrega;
    if (tipo === 'semanal' && !DIAS_ENTREGA_SEMANAL.includes(dia)) return null;
    const presupuesto = calcularPresupuestoMayorista(currentStore.mayoristaItems);
    if (!presupuesto.valido) return null;
    const pedido = this.createOrder({
      tipoPedido: tipo === 'semanal' ? 'Pedido Mayorista · Semanal' : 'Pedido Mayorista · Evento',
      tipoMayorista: tipo,
      diaEntregaSemanal: tipo === 'semanal' ? dia : undefined,
      requiereAprobacion: true,
      aprobacionTienda: 'Pendiente',
      estadoPago: 'Pendiente de aprobación',
      modalidadEntrega: tipo === 'semanal' ? 'Entrega semanal' : 'A coordinar con la tienda',
      domicilioEntrega: currentStore.cliente.direccion,
      telefonoContacto: currentStore.cliente.telefono,
      fechaEntregaEstimada: tipo === 'semanal' ? `Entrega semanal: ${dia} (sujeto a aprobación)` : 'A confirmar por la tienda',
      medioPago: 'A coordinar tras la aprobación',
      nroFactura: 'No emitida',
      nroRemito: 'No emitido',
      señaExigida: 0,
      señaAbonada: 0,
      saldoPendiente: presupuesto.total,
      subtotal: presupuesto.subtotal,
      descuento: presupuesto.descuento,
      envio: 0,
      total: presupuesto.total,
      items: presupuesto.items,
    }, { clearCart: false });
    currentStore = { ...currentStore, mayoristaItems: {}, mayoristaEntrega: { tipo: 'evento', dia: '' } };
    emitChange();
    return pedido;
  },

  acceptWholesaleOrder(nroPedido) {
    currentStore = { ...currentStore, pedidos: currentStore.pedidos.map((pedido) =>
      pedido.nroPedido === nroPedido && pedido.requiereAprobacion && pedido.estadoPedido === 'Pendiente' && pedido.aprobacionTienda === 'Pendiente'
        ? { ...pedido, aprobacionTienda: 'Aceptado', estadoPedido: 'En Producción', trackingStep: 1, estadoPago: 'Pendiente de pago' }
        : pedido
    ) };
    emitChange();
  },

  createOrder(orderData, { clearCart = true } = {}) {
    const nextId = 1000 + currentStore.pedidos.length + 1;
    const nroPedido = `PED-2026-${String(nextId).padStart(3, '0')}`;
    const fechaActual = new Date().toISOString().split('T')[0];

    const nuevoPedido = {
      idComprobantePedidoCliente: nextId,
      nroPedido,
      fechaEmision: fechaActual,
      trackingStep: 0, // Recibido
      estadoPedido: 'Pendiente',
      nroRemito: `REM-0001-0000${nextId + 7400}`,
      nroFactura: `FC-B-0001-0000${nextId + 3500}`,
      ...orderData,
    };

    currentStore = {
      ...currentStore,
      pedidos: [nuevoPedido, ...currentStore.pedidos],
      cart: clearCart ? [] : currentStore.cart,
    };
    emitChange();
    return nuevoPedido;
  },

  cancelOrder(nroPedido, motivo) {
    const newPedidos = currentStore.pedidos.map((p) => {
      if (p.nroPedido === nroPedido) {
        const esEvento = p.tipoPedido.includes('Evento') && p.señaAbonada > 0;
        return {
          ...p,
          estadoPedido: 'Cancelado',
          trackingStep: -1,
          motivoCancelacion: motivo || (esEvento ? 'Cancelación con retención de seña del 50% según condiciones del servicio.' : 'Cancelado a solicitud del cliente.'),
          estadoPago: esEvento ? 'Seña Retenida (50%)' : 'Cancelado / Reintegrado',
        };
      }
      return p;
    });
    currentStore = { ...currentStore, pedidos: newPedidos };
    emitChange();
  },

  createExchangeClaim({ nroPedidoOriginal, productoAfectado, descripcionFalla, cantidad = 1 }) {
    const nextId = 1000 + currentStore.pedidos.length + 1;
    const nroCanje = `CANJE-2026-${String(nextId).padStart(3, '0')}`;
    const fechaActual = new Date().toISOString().split('T')[0];

    const ordenCanje = {
      idComprobantePedidoCliente: nextId,
      nroPedido: nroCanje,
      tipoPedido: 'Canje sin Costo (Garantía de Calidad)',
      fechaEmision: fechaActual,
      fechaEntregaEstimada: 'Inmediata / Próximo Reparto',
      modalidadEntrega: 'Reparto Express Fábrica sin Cargo',
      domicilioEntrega: currentStore.cliente.direccion,
      telefonoContacto: currentStore.cliente.telefono,
      estadoPedido: 'En Producción',
      estadoPago: 'Canje sin Costo ($0)',
      medioPago: 'Garantía PastaFab',
      trackingStep: 1,
      señaExigida: 0,
      señaAbonada: 0,
      saldoPendiente: 0,
      subtotal: 0,
      descuento: 0,
      envio: 0,
      total: 0, // Cero costo bajo garantía oficial
      pedidoOriginalAsociado: nroPedidoOriginal,
      motivoReclamo: descripcionFalla,
      nroRemito: `REM-CANJE-${nextId}`,
      nroFactura: 'N/A (Comprobante de Devolución $0)',
      items: [
        {
          idProducto: 999,
          nombre: `Reposición de Calidad: ${productoAfectado}`,
          cantidad,
          precioUnitario: 0,
          subtotal: 0,
        },
      ],
    };

    currentStore = {
      ...currentStore,
      pedidos: [ordenCanje, ...currentStore.pedidos],
    };
    emitChange();
    return ordenCanje;
  },

  // ── Acciones de Medios de Pago ──────────────────────────────────────────
  addPaymentMethod(newMethod) {
    const nextId = currentStore.mediosPago.length + 1;
    const created = {
      idMedioDePago: nextId,
      esDefault: false,
      ...newMethod,
    };
    currentStore = {
      ...currentStore,
      mediosPago: [...currentStore.mediosPago, created],
    };
    emitChange();
  },

  removePaymentMethod(idMedioDePago) {
    const newMethods = currentStore.mediosPago.filter((m) => m.idMedioDePago !== idMedioDePago);
    currentStore = { ...currentStore, mediosPago: newMethods };
    emitChange();
  },

  setDefaultPaymentMethod(idMedioDePago) {
    const newMethods = currentStore.mediosPago.map((m) => ({
      ...m,
      esDefault: m.idMedioDePago === idMedioDePago,
    }));
    currentStore = { ...currentStore, mediosPago: newMethods };
    emitChange();
  },
};

export const useClientStore = () => {
  return useSyncExternalStore(clientStore.subscribe, clientStore.getState);
};
