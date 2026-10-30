export const today = () => new Date().toLocaleDateString('en-CA', {
  timeZone: 'America/Argentina/Buenos_Aires'
});
export const money = value => Number(value || 0).toLocaleString('es-AR', {
  style: 'currency',
  currency: 'ARS'
});
export const nextId = (rows, prefix) => `${prefix}${String(Math.max(0, ...rows.filter(r => r.id.startsWith(prefix)).map(r => Number(r.id.slice(prefix.length)) || 0)) + 1).padStart(4, '0')}`;
export const validBudget = (budget, date = today()) => budget?.estado === 'Aprobado' && budget.validezHasta >= date;
export const itemTotal = items => items.reduce((sum, item) => sum + Math.round(Number(item.cantidad) * Number(item.precioUnitario) * 100) / 100, 0);
export const validItems = items => items.length > 0 && new Set(items.map(i => `${i.materiaPrima}|${i.unidad}`)).size === items.length && items.every(item => item.materiaPrima?.trim() && item.unidad && Number.isFinite(Number(item.cantidad)) && Number(item.cantidad) > 0 && Number.isFinite(Number(item.precioUnitario)) && Number(item.precioUnitario) > 0);
export function receivedStockDetails(stock, receipts) {
  return Object.entries(stock).map(([key, cantidad]) => {
    const [materiaPrima, unidad] = key.split('|');
    const recepciones = receipts.flatMap(remito => {
      const item = remito.items.find(i => i.materiaPrima === materiaPrima && i.unidad === unidad);
      return item?.cantidadRecibida > 0 ? [{ remito, cantidad: item.cantidadRecibida }] : [];
    });
    return { materiaPrima, unidad, cantidad, recepciones };
  });
}
export function pendingItems(order, receipts) {
  return order.items.map(item => {
    const recibida = receipts.filter(r => r.ordenCompraId === order.id).reduce((sum, r) => sum + r.items.filter(i => i.materiaPrima === item.materiaPrima && i.unidad === item.unidad).reduce((total, i) => total + Number(i.cantidadRecibida || 0), 0), 0);
    return {
      ...item,
      recibida,
      pendiente: Math.max(0, item.cantidad - recibida)
    };
  });
}
export function receivePurchase(state, receipt) {
  if (!receipt.id?.trim()) throw new Error('Ingresá el número de remito.');
  if (state.remitos.some(r => r.id.trim().toLowerCase() === receipt.id.trim().toLowerCase())) throw new Error('Este número de remito ya fue registrado.');
  const order = state.ordenes.find(o => o.id === receipt.ordenCompraId);
  if (!order || !['Enviada', 'Recibida Parcial'].includes(order.estado)) throw new Error('Seleccioná una orden enviada con saldo pendiente.');
  if (!receipt.fechaEntregaReal) throw new Error('Indicá la fecha de recepción.');
  const pending = pendingItems(order, state.remitos);
  if (!receipt.items?.length || new Set(receipt.items.map(i => `${i.materiaPrima}|${i.unidad}`)).size !== receipt.items.length) throw new Error('Revisá los insumos de la recepción.');
  const accepted = receipt.items.map(item => {
    const source = pending.find(i => i.materiaPrima === item.materiaPrima && i.unidad === item.unidad);
    const amount = Number(item.cantidadRecibida);
    if (!source || !Number.isFinite(amount) || amount < 0 || amount > source.pendiente) throw new Error(`La cantidad de ${item.materiaPrima} debe estar entre 0 y ${source?.pendiente ?? 0}.`);
    return {
      ...item,
      cantidadRecibida: amount
    };
  }).filter(i => i.cantidadRecibida > 0);
  if (!accepted.length) throw new Error('Ingresá al menos una cantidad aceptada mayor que cero.');
  const saved = {
    ...receipt,
    id: receipt.id.trim(),
    proveedorId: order.proveedorId,
    proveedorNombre: order.proveedorNombre,
    estado: 'Confirmado',
    items: accepted
  };
  const remitos = [saved, ...state.remitos];
  const complete = pendingItems(order, remitos).every(i => i.pendiente === 0);
  const stock = {
    ...state.stock
  };
  accepted.forEach(i => {
    const key = `${i.materiaPrima}|${i.unidad}`;
    stock[key] = (stock[key] || 0) + i.cantidadRecibida;
  });
  return {
    ...state,
    remitos,
    stock,
    ordenes: state.ordenes.map(o => o.id === order.id ? {
      ...o,
      estado: complete ? 'Cumplida' : 'Recibida Parcial'
    } : o)
  };
}
