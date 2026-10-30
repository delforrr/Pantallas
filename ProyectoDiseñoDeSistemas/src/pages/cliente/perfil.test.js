import test from 'node:test';
import assert from 'node:assert/strict';
import { autenticarCliente, registrarCliente, cerrarSesionCliente, clientStore, CATALOGO_CLIENTE } from './mockData.js';

test('los datos del perfil se conservan al volver a ingresar y se usan en pedidos nuevos', () => {
  const email = 'perfil.prueba@example.com';
  registrarCliente({ name: 'Cliente Prueba', email, password: 'prueba123' });
  assert.equal(clientStore.getState().cliente.direccion, '');
  assert.equal(clientStore.getState().cliente.telefono, '');
  assert.equal(clientStore.getState().cart.length, 0);
  const resultado = clientStore.actualizarPerfilCliente({ nombre: 'Cliente Editado', email, documentoTipo: 'DNI', documentoNumero: '30.123.456', telefono: '+54 11 5555-0101', direccion: 'Calle Prueba 123', localidad: 'Localidad de prueba', provincia: 'Buenos Aires', codigoPostal: '6400', referencias: 'Timbre 2' });
  assert.equal(resultado.errores, undefined);
  assert.equal(resultado.profile.name, 'Cliente Editado');
  assert.equal(clientStore.getState().cliente.dni, '30123456');
  cerrarSesionCliente();
  assert.equal(autenticarCliente(email, 'prueba123').profile.name, 'Cliente Editado');
  assert.equal(clientStore.getState().cliente.referencias, 'Timbre 2');
  const producto = CATALOGO_CLIENTE[0];
  clientStore.addWholesaleToCart(producto, 10);
  const pedido = clientStore.createWholesaleOrder();
  assert.equal(pedido.domicilioEntrega, 'Calle Prueba 123');
  assert.equal(pedido.telefonoContacto, '+54 11 5555-0101');
});

test('rechazar un perfil inválido no modifica los datos guardados', () => {
  const anterior = clientStore.getState().cliente;
  const resultado = clientStore.actualizarPerfilCliente({ ...anterior, nombre: ' ', documentoTipo: 'DNI', documentoNumero: '123', telefono: 'abc', codigoPostal: '123456' });
  assert.ok(resultado.errores.nombre);
  assert.ok(resultado.errores.documentoNumero);
  assert.ok(resultado.errores.telefono);
  assert.ok(resultado.errores.codigoPostal);
  assert.equal(clientStore.getState().cliente, anterior);
});

test('una cuenta nueva no recibe los datos personales ni los pedidos de otra cuenta', () => {
  cerrarSesionCliente();
  registrarCliente({ name: 'Otra Cuenta', email: 'otro.perfil@example.com', password: 'prueba123' });
  const { cliente, pedidos } = clientStore.getState();
  assert.equal(cliente.nombre, 'Otra Cuenta');
  assert.equal(cliente.direccion, '');
  assert.equal(cliente.telefono, '');
  assert.equal(cliente.dni, '');
  assert.deepEqual(pedidos, []);
});
