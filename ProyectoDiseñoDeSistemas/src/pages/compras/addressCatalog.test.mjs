import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addAddressOption, buildAddressCatalog, selectAddressOption } from './addressCatalog.js';
const first = { provincia: 'Buenos Aires', localidad: 'Trenque Lauquen', calle: 'San Martín', altura: '1450' };
const other = { provincia: 'La Pampa', localidad: 'General Pico', calle: 'San Martín' };

test('el catálogo conserva las relaciones y permite nombres iguales en distintos domicilios', () => {
 const catalog = buildAddressCatalog([first, first, other]);
 assert.equal(catalog.provincias.length, 2);
 assert.equal(catalog.localidades.length, 2);
 assert.equal(catalog.calles.length, 2);
 assert.deepEqual(catalog.calles.filter(c => c.provincia === first.provincia && c.localidad === first.localidad).map(c => c.nombre), ['San Martín']);
 const next = addAddressOption(catalog, 'localidad', 'General Pico', first);
 assert.equal(next.localidades.length, 3);
 assert.equal(catalog.localidades.length, 2);
});
test('las altas exigen contexto y evitan nombres vacíos o duplicados', () => {
 const catalog = buildAddressCatalog([first]);
 assert.throws(() => addAddressOption(catalog, 'provincia', '   '));
 assert.throws(() => addAddressOption(catalog, 'provincia', ' buenos aires '), /ya está/);
 assert.throws(() => addAddressOption(catalog, 'calle', 'san martin', first), /ya está/);
 assert.throws(() => addAddressOption(catalog, 'localidad', 'Otra', { provincia: 'Inexistente' }), /provincia/);
 assert.throws(() => addAddressOption(catalog, 'calle', 'Otra', { ...first, localidad: 'Inexistente' }), /localidad/);
 const province = addAddressOption(catalog, 'provincia', 'Córdoba');
 const locality = addAddressOption(province, 'localidad', 'Río Cuarto', { provincia: 'Córdoba' });
 const street = addAddressOption(locality, 'calle', 'Mitre', { provincia: 'Córdoba', localidad: 'Río Cuarto' });
 assert.deepEqual(street.calles.at(-1), { nombre: 'Mitre', provincia: 'Córdoba', localidad: 'Río Cuarto' });
});
test('cambiar provincia o localidad limpia las selecciones descendientes', () => {
 assert.deepEqual(selectAddressOption(first, 'provincia', 'La Pampa'), { ...first, provincia: 'La Pampa', localidad: '', calle: '' });
 assert.deepEqual(selectAddressOption(first, 'localidad', 'Otra'), { ...first, localidad: 'Otra', calle: '' });
 assert.deepEqual(selectAddressOption(first, 'calle', 'Mitre'), { ...first, calle: 'Mitre' });
});
