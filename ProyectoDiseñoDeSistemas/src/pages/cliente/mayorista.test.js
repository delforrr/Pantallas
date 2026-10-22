import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO_CLIENTE, MINIMO_MAYORISTA, calcularPresupuestoMayorista, clientStore, validarCantidadMayorista } from './mockData.js';

test('el presupuesto mayorista exige enteros, mínimo por producto y stock disponible', () => {
  const producto = CATALOGO_CLIENTE[0];
  for (const cantidad of [MINIMO_MAYORISTA - 1, 10.5, producto.stock + 1]) {
    assert.equal(calcularPresupuestoMayorista({ [producto.idProducto]: cantidad }).valido, false);
  }
  assert.equal(calcularPresupuestoMayorista({}).valido, false);
  assert.equal(calcularPresupuestoMayorista({ inexistente: 10 }).valido, false);
  const presupuesto = calcularPresupuestoMayorista({ [producto.idProducto]: MINIMO_MAYORISTA });
  assert.equal(presupuesto.subtotal, producto.precio * MINIMO_MAYORISTA);
  assert.equal(presupuesto.descuento, Math.round(presupuesto.subtotal * 0.1));
  assert.equal(presupuesto.total, presupuesto.subtotal - presupuesto.descuento);
});

test('aceptar el presupuesto crea un pendiente sin pago y conserva el carrito habitual', () => {
  const producto = CATALOGO_CLIENTE[0];
  const carrito = clientStore.getState().cart;
  assert.equal(clientStore.createWholesaleOrder(), null);
  clientStore.setWholesaleQuantity(producto.idProducto, MINIMO_MAYORISTA - 1);
  assert.deepEqual(clientStore.getState().mayoristaItems, {});
  clientStore.setWholesaleQuantity(producto.idProducto, MINIMO_MAYORISTA);
  const pedido = clientStore.createWholesaleOrder();
  assert.equal(pedido.estadoPedido, 'Pendiente');
  assert.equal(pedido.aprobacionTienda, 'Pendiente');
  assert.equal(pedido.señaAbonada, 0);
  assert.equal(pedido.saldoPendiente, pedido.total);
  assert.equal(pedido.nroFactura, 'No emitida');
  assert.equal(clientStore.getState().cart, carrito);
  assert.deepEqual(clientStore.getState().mayoristaItems, {});
  assert.equal(clientStore.createWholesaleOrder(), null);
  clientStore.acceptWholesaleOrder(pedido.nroPedido);
  const aceptado = clientStore.getState().pedidos.find((p) => p.nroPedido === pedido.nroPedido);
  assert.equal(aceptado.estadoPedido, 'En Producción');
  assert.equal(aceptado.aprobacionTienda, 'Aceptado');
  assert.equal(aceptado.estadoPago, 'Pendiente de pago');
});

test('la tienda no puede aceptar un mayorista cancelado por el cliente', () => {
  const producto = CATALOGO_CLIENTE[0];
  clientStore.setWholesaleQuantity(producto.idProducto, MINIMO_MAYORISTA);
  const pedido = clientStore.createWholesaleOrder();
  clientStore.cancelOrder(pedido.nroPedido, 'Cancelado antes de la aprobación');
  clientStore.acceptWholesaleOrder(pedido.nroPedido);
  assert.equal(clientStore.getState().pedidos.find((p) => p.nroPedido === pedido.nroPedido).estadoPedido, 'Cancelado');
});

test('agregar mayoristas abre su carrito, acumula cantidades y respeta el stock', () => {
  const producto = CATALOGO_CLIENTE[0];
  const carritoHabitual = clientStore.getState().cart;
  assert.equal(clientStore.addWholesaleToCart(producto, MINIMO_MAYORISTA - 1), false);
  assert.equal(clientStore.addWholesaleToCart(producto, MINIMO_MAYORISTA), true);
  assert.equal(clientStore.getState().carritoModo, 'mayorista');
  assert.equal(clientStore.addWholesaleToCart(producto, MINIMO_MAYORISTA), true);
  assert.equal(clientStore.getState().mayoristaItems[producto.idProducto], 2 * MINIMO_MAYORISTA);
  assert.equal(clientStore.addWholesaleToCart(producto, producto.stock), false);
  assert.equal(clientStore.getState().cart, carritoHabitual);
  clientStore.setWholesaleQuantity(producto.idProducto, 0);
});

test('el mayorista semanal requiere día y lo conserva al aprobarse', () => {
  const producto = CATALOGO_CLIENTE[0];
  clientStore.setWholesaleQuantity(producto.idProducto, MINIMO_MAYORISTA);
  clientStore.setWholesaleDelivery({ tipo: 'semanal' });
  assert.equal(clientStore.createWholesaleOrder(), null);
  assert.equal(clientStore.getState().mayoristaItems[producto.idProducto], MINIMO_MAYORISTA);
  clientStore.setWholesaleDelivery({ tipo: 'semanal', dia: 'Día inválido' });
  assert.equal(clientStore.getState().mayoristaEntrega.dia, '');
  clientStore.setWholesaleDelivery({ tipo: 'semanal', dia: 'Miércoles' });
  const pedido = clientStore.createWholesaleOrder();
  assert.equal(pedido.tipoMayorista, 'semanal');
  assert.equal(pedido.diaEntregaSemanal, 'Miércoles');
  assert.equal(pedido.estadoPedido, 'Pendiente');
  clientStore.acceptWholesaleOrder(pedido.nroPedido);
  assert.equal(clientStore.getState().pedidos.find((p) => p.nroPedido === pedido.nroPedido).diaEntregaSemanal, 'Miércoles');
});

test('el mayorista para evento no guarda día semanal ni retiene una seña no abonada', () => {
  const producto = CATALOGO_CLIENTE[0];
  clientStore.setWholesaleDelivery({ tipo: 'semanal', dia: 'Lunes' });
  clientStore.setWholesaleDelivery({ tipo: 'evento' });
  assert.equal(clientStore.getState().mayoristaEntrega.dia, '');
  clientStore.setWholesaleQuantity(producto.idProducto, MINIMO_MAYORISTA);
  const pedido = clientStore.createWholesaleOrder();
  assert.equal(pedido.tipoMayorista, 'evento');
  assert.equal(pedido.diaEntregaSemanal, undefined);
  clientStore.cancelOrder(pedido.nroPedido);
  assert.notEqual(clientStore.getState().pedidos.find((p) => p.nroPedido === pedido.nroPedido).estadoPago, 'Seña Retenida (50%)');
});

test('validarCantidadMayorista exige minimo de 10 unidades para semanal y eventos', () => {
  // Para semanal
  assert.equal(validarCantidadMayorista('semanal', 9).valido, false);
  assert.equal(validarCantidadMayorista('semanal', 9).faltantes, 1);
  assert.equal(validarCantidadMayorista('semanal', 10).valido, true);
  assert.equal(validarCantidadMayorista('semanal', 10).faltantes, 0);

  // Para evento
  assert.equal(validarCantidadMayorista('evento', 9).valido, false);
  assert.equal(validarCantidadMayorista('evento', 9).faltantes, 1);
  assert.equal(validarCantidadMayorista('evento', 10).valido, true);
  assert.equal(validarCantidadMayorista('evento', 10).faltantes, 0);
});

test('los tipos de productos son exactamente 3: Pastas Frescas, Pastas Secas y Otros', async () => {
  const { TIPOS_PRODUCTO, CATEGORIAS_PRODUCTOS, CATALOGO_CLIENTE } = await import('./mockData.js');
  assert.deepEqual(TIPOS_PRODUCTO, ['Pastas Frescas', 'Pastas Secas', 'Otros']);
  assert.equal(TIPOS_PRODUCTO.length, 3);
  assert.deepEqual(CATEGORIAS_PRODUCTOS, ['Todos', 'Pastas Frescas', 'Pastas Secas', 'Otros']);

  // Cada producto del catálogo debe pertenecer estrictamente a uno de los 3 tipos
  for (const producto of CATALOGO_CLIENTE) {
    assert.ok(
      TIPOS_PRODUCTO.includes(producto.categoria),
      `El producto ${producto.nombre} tiene una categoría no válida: ${producto.categoria}`
    );
  }
});

