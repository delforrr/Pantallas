export function emisionActual(ahora = new Date()) {
  const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString();
  return { fechaEmision: local.slice(0, 10), horaEmision: local.slice(11, 16) };
}

export function validarProductos(items, minimo = 1) {
  return items.length > 0 && items.every(item => item.idProductoCompuesto &&
    Number.isInteger(Number(item.cantidad)) && Number(item.cantidad) >= minimo &&
    Number.isFinite(Number(item.precioUnitario)) && Number(item.precioUnitario) >= 0);
}
