export const localNow = () => new Date().toLocaleString('sv-SE', {
  timeZone: 'America/Argentina/Buenos_Aires'
}).slice(0, 16);
export const nextMachineCode = machines => `MAQ-${String(Math.max(0, ...machines.map(m => Number(m.codigo.replace('MAQ-', '')) || 0)) + 1).padStart(3, '0')}`;
export const MAINTENANCE_RESULT_STATES = ['Operativa', 'En Reparación', 'Fuera de Servicio'];
export function transitionOrder(state, id, target, result = {}) {
  const order = state.ordenes.find(o => o.id === id);
  if (!order || target === 'En Proceso' && order.estado !== 'Pendiente' || target === 'Finalizada' && order.estado !== 'En Proceso' || !['En Proceso', 'Finalizada'].includes(target)) throw new Error('La orden ya cambió de estado.');
  const finishedAt = typeof result.fechaFin === 'string' ? result.fechaFin.replace(' ', 'T') : '';
  if (target === 'Finalizada') {
    if (!result.tareaRealizada?.trim()) throw new Error('Indicá el trabajo realizado.');
    if (!MAINTENANCE_RESULT_STATES.includes(result.estadoMaquina)) throw new Error('Al finalizar, la máquina debe quedar operativa, en reparación o fuera de servicio.');
    // Se valida el calendario sin convertir la hora local elegida.
    const parsed = new Date(`${finishedAt}:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(finishedAt) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 16) !== finishedAt) throw new Error('Indicá una fecha y hora de conclusión válidas.');
    if (order.fechaInicio && finishedAt < order.fechaInicio.replace(' ', 'T')) throw new Error('La conclusión no puede ser anterior al inicio del mantenimiento.');
  }
  const updated = target === 'En Proceso' ? {
    ...order,
    estado: target,
    fechaInicio: localNow()
  } : {
    ...order,
    ...result,
    estado: target,
    fechaFin: finishedAt.replace('T', ' '),
    tareaRealizada: result.tareaRealizada.trim()
  };
  const machineState = target === 'En Proceso' ? order.tipo === 'Correctivo' ? 'En Reparación' : 'En Mantenimiento' : result.estadoMaquina;
  return {
    ...state,
    ordenes: state.ordenes.map(o => o.id === id ? updated : o),
    maquinarias: state.maquinarias.map(m => m.id === order.maquinariaId ? {
      ...m,
      estado: machineState
    } : m)
  };
}
export function createMaintenanceOrder(orders, machines, technicians, form) {
  const machine = machines.find(m => m.id === Number(form.maquinariaId));
  const technician = technicians.find(t => t.id === Number(form.empleadoId));
  if (!machine || !technician || !form.descripcion?.trim() || !['Preventivo', 'Correctivo'].includes(form.tipo)) throw new Error('Seleccioná una máquina, un técnico y describí el trabajo previsto.');
  return {
    ...form,
    id: `OM-${localNow().slice(0, 4)}-${String(Math.max(0, ...orders.map(o => Number(o.id.split('-').at(-1)) || 0)) + 1).padStart(4, '0')}`,
    maquinariaId: machine.id,
    maquinariaCodigo: machine.codigo,
    maquinariaNombre: machine.nombre,
    empleadoId: technician.id,
    tecnicoNombre: technician.nombre,
    descripcion: form.descripcion.trim(),
    fechaEmision: form.fechaEmision || localNow().slice(0, 10),
    estado: 'Pendiente',
    fechaInicio: null,
    fechaFin: null,
    tareaRealizada: ''
  };
}
