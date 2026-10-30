const sameName = (a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }) === 0;

export function addAddressOption(catalog, type, name, address = {}) {
  const nombre = name.trim();
  if (!nombre) throw new Error('Ingresá un nombre.');
  if (type !== 'provincia' && !catalog.provincias.includes(address.provincia)) throw new Error('Seleccioná primero una provincia.');
  if (type === 'calle' && !catalog.localidades.some(l => l.provincia === address.provincia && l.nombre === address.localidad)) throw new Error('Seleccioná primero una localidad.');
  if (type === 'provincia') {
    if (catalog.provincias.some(p => sameName(p, nombre))) throw new Error('La provincia ya está registrada.');
    return { ...catalog, provincias: [...catalog.provincias, nombre] };
  }
  if (type === 'localidad') {
    if (catalog.localidades.some(l => l.provincia === address.provincia && sameName(l.nombre, nombre))) throw new Error('La localidad ya está registrada en esta provincia.');
    return { ...catalog, localidades: [...catalog.localidades, { nombre, provincia: address.provincia }] };
  }
  if (type !== 'calle') throw new Error('Tipo de domicilio inválido.');
  if (catalog.calles.some(c => c.provincia === address.provincia && c.localidad === address.localidad && sameName(c.nombre, nombre))) throw new Error('La calle ya está registrada en esta localidad.');
  return { ...catalog, calles: [...catalog.calles, { nombre, provincia: address.provincia, localidad: address.localidad }] };
}

export function buildAddressCatalog(providers) {
  let catalog = { provincias: [], localidades: [], calles: [] };
  for (const provider of providers) {
    if (!catalog.provincias.includes(provider.provincia)) catalog = addAddressOption(catalog, 'provincia', provider.provincia);
    if (!catalog.localidades.some(l => l.provincia === provider.provincia && l.nombre === provider.localidad)) catalog = addAddressOption(catalog, 'localidad', provider.localidad, provider);
    if (provider.calle && !catalog.calles.some(c => c.provincia === provider.provincia && c.localidad === provider.localidad && c.nombre === provider.calle)) catalog = addAddressOption(catalog, 'calle', provider.calle, provider);
  }
  return catalog;
}

export function selectAddressOption(address, type, name) {
  if (type === 'provincia') return { ...address, provincia: name, localidad: '', calle: '' };
  if (type === 'localidad') return { ...address, localidad: name, calle: '' };
  return { ...address, calle: name };
}
