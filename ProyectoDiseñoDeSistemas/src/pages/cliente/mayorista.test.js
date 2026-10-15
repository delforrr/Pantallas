import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO_CLIENTE, MINIMO_MAYORISTA, calcularPresupuestoMayorista, clientStore } from './mockData.js';

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
