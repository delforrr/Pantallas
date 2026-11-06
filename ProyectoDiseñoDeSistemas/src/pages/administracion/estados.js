export const gruposEstados = {
  materia_prima: ['Materia prima', 'Activo', 'Inactivo'],
  productos_compuestos: ['Productos', 'Activo', 'Inactivo'],
  proveedores: ['Proveedores', 'Activo', 'Inactivo'],
  presupuesto_proveedor: ['Presupuestos de proveedor', 'Pendiente', 'Aprobado', 'Rechazado', 'Vencido'],
  orden_compra: ['Órdenes de compra', 'Pendiente', 'Enviada', 'Recibida Parcial', 'Cumplida', 'Cancelada'],
  facturas_remitos: ['Facturas, remitos y pagos de proveedor', 'Pendiente de Pago', 'Pagada', 'Anulada', 'Conciliado', 'Enviada', 'Recibida Parcial', 'Cumplida'],
  orden_produccion: ['Órdenes de producción', 'Planificada', 'En Proceso', 'Finalizada', 'Cancelada'],
  ordenes_mantenimiento: ['Órdenes de mantenimiento', 'Pendiente', 'En Proceso', 'Finalizada', 'Cancelada'],
  maquinaria: ['Maquinaria', 'Operativa', 'En Mantenimiento', 'En Reparación', 'Fuera de Servicio'],
  pedidos: ['Pedidos de venta', 'Pendiente', 'En Preparación', 'Finalizado', 'Cancelado'],
  presupuestos: ['Presupuestos de venta', 'Pendiente', 'Aceptado', 'Expirado'],
  comprobantes_venta: ['Comprobantes de venta', 'Pendiente de Cobro', 'Pagada'],
};

export const estadosBase = Object.entries(gruposEstados).flatMap(([grupo, [, ...valores]]) =>
  valores.map(valor => ({ id: `${grupo}:${valor}`, padre: grupo, nombre: valor, valor })));
