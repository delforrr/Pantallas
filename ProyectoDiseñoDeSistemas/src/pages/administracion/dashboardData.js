import { INITIAL_COMPROBANTES_PAGO, INITIAL_PEDIDOS } from '../ventas/mockData.js';
import { INITIAL_ORDENES_COMPRA } from '../compras/mockData.js';
import { MATERIAS_PRIMAS_INICIALES } from '../produccion/mockData.js';
import { INITIAL_MAQUINARIAS } from '../mantenimiento/mockData.js';

export const FECHA_DEMO = '2026-09-26';
const fechaLarga = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: 'UTC' });
const fechaCorta = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
const mesYAnio = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
export const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
export const porcentaje = new Intl.NumberFormat('es-AR', { style: 'percent', minimumFractionDigits: 1 });
const cantidad = new Intl.NumberFormat('es-AR');

export const fechaVisible = (fecha) => fechaLarga.format(new Date(fecha));

function esFechaValida(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const parsed = new Date(fecha);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === fecha;
}

const pedidosAbiertos = INITIAL_PEDIDOS.filter(
  (pedido) => !['Finalizado', 'Cancelado'].includes(pedido.estadoPedido) &&
    esFechaValida(pedido.fechaEntregaEstimada),
);

const alertasPedidos = pedidosAbiertos
  .filter((pedido) => pedido.fechaEntregaEstimada <= FECHA_DEMO)
  .map((pedido) => {
    const vencido = pedido.fechaEntregaEstimada < FECHA_DEMO;
    return {
      referencia: pedido.nroPedido,
      nombre: pedido.clienteNombre,
      destino: 'pedidos',
      prioridad: vencido ? 0 : 1,
      estado: vencido ? 'Pedido vencido' : 'Entrega para hoy',
      detalle: fechaVisible(pedido.fechaEntregaEstimada),
    };
  });

const alertasInsumos = MATERIAS_PRIMAS_INICIALES
  .filter((insumo) => insumo.stockActual <= insumo.stockMinimo)
  .map((insumo) => ({
    referencia: `MP-${insumo.idMateriaPrima}`,
    nombre: insumo.nombre,
    destino: 'materia_prima',
    prioridad: insumo.stockActual === 0 ? 0 : 3,
    estado: insumo.stockActual === 0 ? 'Insumo agotado' : 'Stock en alerta',
    detalle: `${cantidad.format(insumo.stockActual)} ${insumo.unidad} · mínimo ${cantidad.format(insumo.stockMinimo)}`,
  }));

const alertasRecepciones = INITIAL_ORDENES_COMPRA
  .filter((orden) => ['Enviada', 'Recibida Parcial'].includes(orden.estado) &&
    esFechaValida(orden.fechaEntregaEstimada) && orden.fechaEntregaEstimada < FECHA_DEMO)
  .sort((a, b) => a.fechaEntregaEstimada.localeCompare(b.fechaEntregaEstimada))
  .map((orden) => ({
    referencia: orden.id,
    nombre: orden.proveedorNombre,
    destino: 'orden_compra',
    prioridad: 2,
    estado: 'Recepción atrasada',
    detalle: fechaVisible(orden.fechaEntregaEstimada),
  }));

const alertasMaquinas = INITIAL_MAQUINARIAS
  .filter((maquina) => maquina.estado === 'Fuera de Servicio')
  .map((maquina) => ({
    referencia: maquina.codigo,
    nombre: maquina.nombre,
    destino: 'maquinaria',
    prioridad: 0,
    estado: 'Fuera de servicio',
    detalle: maquina.observaciones,
  }));

export const alertas = [...alertasPedidos, ...alertasInsumos, ...alertasRecepciones, ...alertasMaquinas]
  .sort((a, b) => a.prioridad - b.prioridad);

const [anio, mes, dia] = FECHA_DEMO.split('-').map(Number);

export const entregas = Array.from({ length: 7 }, (_, indice) => {
  const fecha = new Date(Date.UTC(anio, mes - 1, dia + indice));
  const iso = fecha.toISOString().slice(0, 10);
  return {
    fecha: iso,
    etiqueta: indice === 0 ? 'Hoy' : fechaCorta.format(fecha),
    cantidad: pedidosAbiertos.filter((pedido) => pedido.fechaEntregaEstimada === iso).length,
  };
});

export const mesesCobros = Array.from({ length: 3 }, (_, indice) => {
  const fecha = new Date(Date.UTC(anio, mes - 1 - indice, 1));
  return { valor: fecha.toISOString().slice(0, 7), etiqueta: mesYAnio.format(fecha) };
});

const tiposPedido = new Map([
  ['Mayorista Semanal Fijo', 'Mayorista semanal'],
  ['Evento Especial (Cena 48hs)', 'Eventos'],
  ['Venta Mostrador / Local', 'Mostrador'],
  ['Canje por Reclamo (Mal Estado)', 'Canjes'],
  ['Donación Institucional ($0)', 'Donaciones'],
]);

export function cobrosPorTipo(periodo) {
  const centavosPorTipo = new Map();
  for (const pago of INITIAL_COMPROBANTES_PAGO) {
    if (!esFechaValida(pago.fechaEmision) || pago.fechaEmision.slice(0, 7) !== periodo) continue;
    const pedido = INITIAL_PEDIDOS.find((item) =>
      item.idComprobantePedidoCliente === pago.idComprobantePedidoCliente || item.nroPedido === pago.nroPedido);
    const tipo = pago.nroPedido === 'VENTA-DIRECTA-LOCAL'
      ? 'Mostrador'
      : tiposPedido.get(pedido?.tipoPedido) ?? 'Sin clasificar';
    const centavos = Math.round(pago.montoAbonado * 100);
    if (Number.isFinite(centavos) && centavos > 0) {
      centavosPorTipo.set(tipo, (centavosPorTipo.get(tipo) ?? 0) + centavos);
    }
  }

  return Array.from(centavosPorTipo, ([tipo, centavos]) => ({ tipo, centavos }))
    .sort((a, b) => b.centavos - a.centavos);
}
