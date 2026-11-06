import { EMPLEADOS } from '../produccion/mockData.js';
import { INITIAL_TECNICOS } from '../mantenimiento/mockData.js';
import { INITIAL_PROVEEDORES } from '../compras/mockData.js';
import { buildAddressCatalog } from '../compras/addressCatalog.js';

const domicilios = buildAddressCatalog(INITIAL_PROVEEDORES);
export const localidadId = (provincia, localidad) => JSON.stringify([provincia, localidad]);
export const calleId = (provincia, localidad, calle) => JSON.stringify([provincia, localidad, calle]);

export const unidades = ['kg', 'g', 'docenas', 'unidades', 'litros'];
export const tiposMateriaPrima = ['Harinas y Cereales', 'Frescos y Granja', 'Lácteos', 'Verduras', 'Carnes', 'Condimentos', 'Packaging'];

export const catalogosBase = {
  iva: ['Responsable Inscripto', 'Monotributo', 'Consumidor Final', 'Exento'].map(id => ({ id, nombre: id })),
  empleados: [
    ...EMPLEADOS.map(({ idEmpleado, nombre, cargo }) => ({ id: idEmpleado, nombre, cargo, area: 'Producción' })),
    ...INITIAL_TECNICOS.map(({ id, nombre, especialidad }) => ({ id: `tec-${id}`, nombre, cargo: especialidad, area: 'Mantenimiento' })),
  ],
  provincias: domicilios.provincias.map(id => ({ id, nombre: id })),
  localidades: domicilios.localidades.map(({ provincia, nombre }) => ({
    id: localidadId(provincia, nombre), padre: provincia, nombre,
  })),
  calles: domicilios.calles.map(({ provincia, localidad, nombre }) => ({
    id: calleId(provincia, localidad, nombre), padre: localidadId(provincia, localidad), nombre,
  })),
  unidades: unidades.map(id => ({ id, nombre: id })),
  tiposMateriaPrima: tiposMateriaPrima.map(id => ({ id, nombre: id })),
};

export function opciones(registros, actual) {
  return registros.filter(registro => !registro.inactivo || registro.id === actual);
}

export function nombreCatalogo(registros, id) {
  return registros.find(registro => registro.id === id)?.nombre ?? id;
}

export function nombreDuplicado(registros, registro) {
  return registros.some(item => item.id !== registro.id && item.padre === registro.padre &&
    item.nombre.localeCompare(registro.nombre, 'es', { sensitivity: 'base' }) === 0);
}
