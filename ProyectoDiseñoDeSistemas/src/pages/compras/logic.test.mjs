import { test } from 'node:test';
import assert from 'node:assert/strict';
import { receivePurchase, pendingItems, itemTotal, validBudget, nextId, validItems, receivedStockDetails } from './logic.js';
const order = { id: 'OC-1', estado: 'Enviada', proveedorId: 1, items: [{ materiaPrima: 'Harina', unidad: 'Kg', cantidad: 10, precioUnitario: 1.25 }] };
const initial = { ordenes: [order], remitos: [], stock: {} };
const receipt = { id: 'R-1', ordenCompraId: 'OC-1', fechaEntregaReal: '2026-10-28', items: [{ materiaPrima: 'Harina', unidad: 'Kg', cantidadRecibida: 4 }] };
test('recepciones parciales actualizan stock y saldo, sin mutar el estado previo', () => {
 const partial = receivePurchase(initial, receipt);
 assert.equal(partial.stock['Harina|Kg'], 4); assert.equal(initial.remitos.length, 0);
 assert.equal(partial.ordenes[0].estado, 'Recibida Parcial'); assert.equal(pendingItems(order, partial.remitos)[0].pendiente, 6);
 const complete = receivePurchase(partial, { ...receipt, id: 'R-2', items: [{ ...receipt.items[0], cantidadRecibida: 6 }] });
 assert.equal(complete.stock['Harina|Kg'], 10); assert.equal(complete.ordenes[0].estado, 'Cumplida');
 assert.throws(() => receivePurchase(partial, receipt), /ya fue registrado/);
 assert.throws(() => receivePurchase(complete, { ...receipt, id: 'R-3' }), /saldo pendiente/);
});
test('rechaza excesos, cantidades inválidas y líneas repetidas', () => {
 for (const amount of [-1, 11, NaN, Infinity, 0]) assert.throws(() => receivePurchase(initial, { ...receipt, items: [{ ...receipt.items[0], cantidadRecibida: amount }] }));
 assert.throws(() => receivePurchase(initial, { ...receipt, items: [...receipt.items, ...receipt.items] }));
});
test('vigencia, importes y códigos sin colisión después de eliminar', () => {
 assert.equal(itemTotal(order.items), 12.5);
 assert.equal(validBudget({ estado: 'Aprobado', validezHasta: '2026-10-28' }, '2026-10-28'), true);
 assert.equal(validBudget({ estado: 'Aprobado', validezHasta: '2026-10-27' }, '2026-10-28'), false);
 assert.equal(validItems(order.items), true); assert.equal(validItems([]), false);
 assert.equal(nextId([{ id: 'PP-0001' }, { id: 'PP-0003' }], 'PP-'), 'PP-0004');
});

test('el stock recibido conserva la referencia a cada remito y su cantidad aceptada', () => {
 const first = { ...receipt, id: 'R-1' };
 const second = { ...receipt, id: 'R-2', items: [{ materiaPrima: 'Harina', unidad: 'Kg', cantidadRecibida: 6 }] };
 const otherUnit = { ...receipt, id: 'R-3', items: [{ materiaPrima: 'Harina', unidad: 'Bolsas', cantidadRecibida: 2 }] };
 const zero = { ...receipt, id: 'R-4', items: [{ materiaPrima: 'Sal', unidad: 'Kg', cantidadRecibida: 0 }] };
 const rows = receivedStockDetails({ 'Harina|Kg': 10, 'Harina|Bolsas': 2, 'Sal|Kg': 0 }, [first, second, otherUnit, zero]);
 assert.deepEqual(rows[0].recepciones.map(r => [r.remito.id, r.cantidad]), [['R-1', 4], ['R-2', 6]]);
 assert.equal(rows[0].cantidad, 10);
 assert.equal(rows[1].recepciones[0].remito, otherUnit);
 assert.deepEqual(rows[2].recepciones, []);
 assert.deepEqual(receivedStockDetails({}, []), []);
});
