import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transitionOrder, nextMachineCode, createMaintenanceOrder } from './logic.js';
const state = { maquinarias: [{ id: 1, estado: 'Operativa', codigo: 'MAQ-003' }], ordenes: [{ id: 'OM-1', maquinariaId: 1, tipo: 'Correctivo', estado: 'Pendiente' }] };
test('iniciar y cerrar actualiza la misma máquina y requiere resultado', () => {
 const started = transitionOrder(state, 'OM-1', 'En Proceso');
 assert.equal(started.maquinarias[0].estado, 'En Reparación'); assert.equal(state.maquinarias[0].estado, 'Operativa');
 assert.ok(started.ordenes[0].fechaInicio);
 assert.throws(() => transitionOrder(started, 'OM-1', 'Finalizada', {}));
 const done = transitionOrder(started, 'OM-1', 'Finalizada', { tareaRealizada: 'Cambio de junta, registrado en descripción', estadoMaquina: 'Operativa' });
 assert.equal(done.maquinarias[0].estado, 'Operativa'); assert.ok(done.ordenes[0].fechaFin);
 assert.throws(() => transitionOrder(done, 'OM-1', 'Finalizada', {}));
 assert.equal(nextMachineCode(state.maquinarias), 'MAQ-004');
});

test('crear una orden no cambia la máquina y conserva el trabajo previsto', () => {
 const order = createMaintenanceOrder(state.ordenes, [{ ...state.maquinarias[0], nombre: 'Amasadora' }], [{ id: 1, nombre: 'Técnico' }], { maquinariaId: 1, empleadoId: 1, tipo: 'Preventivo', descripcion: 'Lubricar cadena' });
 assert.equal(order.estado, 'Pendiente'); assert.equal(order.fechaInicio, null);
 assert.equal(order.descripcion, 'Lubricar cadena'); assert.equal(order.tareaRealizada, '');
 assert.equal(state.maquinarias[0].estado, 'Operativa');
 assert.throws(() => createMaintenanceOrder([], [], [], { descripcion: '' }));
});
