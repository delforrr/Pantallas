export const unidades = ['kg', 'g', 'docenas', 'unidades', 'litros'];
export const tiposMateriaPrima = ['Harinas y Cereales', 'Frescos y Granja', 'Lácteos', 'Verduras', 'Carnes', 'Condimentos', 'Packaging'];

export const catalogosBase = {
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
