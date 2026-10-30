/** Datos simulados del módulo: una máquina y un técnico por orden.
 * Los repuestos se describen en texto libre, sin gestión de inventario.
 */

export const INITIAL_MAQUINARIAS = [
  {
    id: 1,
    codigo: "MAQ-001",
    nombre: "Amasadora Espiral Industrial 50kg",
    estado: "Operativa",
    horasUso: 340,
    observaciones:
      "Lubricación de cadena principal y cambio de grasa sanitaria al día.",
  },
  {
    id: 2,
    codigo: "MAQ-002",
    nombre: "Laminadora Calibradora de Masa Continua",
    estado: "Operativa",
    horasUso: 410,
    observaciones:
      "Rodillos de acero inoxidable 304 calibrados a 1.2 mm de espesor.",
  },
  {
    id: 3,
    codigo: "MAQ-003",
    nombre: "Rellenadora Automática de Ravioles & Sorrentinos",
    estado: "En Mantenimiento",
    horasUso: 520,
    observaciones: "En revisión de sellado de moldes de ricota y espinaca.",
  },
  {
    id: 4,
    codigo: "MAQ-004",
    nombre: "Cortadora Rotativa de Tallarines y Cintas",
    estado: "Operativa",
    horasUso: 290,
    observaciones:
      "Afilado de cuchillas de corte fino realizado conforme a protocolo.",
  },
  {
    id: 5,
    codigo: "MAQ-005",
    nombre: "Envasadora al Vacío Doble Campana",
    estado: "En Reparación",
    horasUso: 680,
    observaciones:
      "Falla en la electroválvula de vacío principal. Requiere revisión técnica.",
  },
  {
    id: 6,
    codigo: "MAQ-006",
    nombre: "Secadero Estático de Pastas Cortadas",
    estado: "Operativa",
    horasUso: 820,
    observaciones:
      "Higrometría y sensores de temperatura testeados y calibrados.",
  },
  {
    id: 7,
    codigo: "MAQ-007",
    nombre: "Paila Volcable Cocinadora de Salsas 100L",
    estado: "Operativa",
    horasUso: 310,
    observaciones: "Agitador mecánico y quemadores con llama pareja y limpia.",
  },
  {
    id: 8,
    codigo: "MAQ-008",
    nombre: "Formadora de Ñoquis Rotativa con Ranurado",
    estado: "Fuera de Servicio",
    horasUso: 950,
    observaciones:
      "Fuera de servicio por desgaste de rodillo acanalador. En espera de repuesto de tornería.",
  },
];

export const INITIAL_TECNICOS = [
  {
    id: 1,
    legajo: "TEC-01",
    nombre: "Carlos Vignolo",
    especialidad: "Mantenimiento Mecánico y Engranajes",
    turno: "Mañana",
  },
  {
    id: 2,
    legajo: "TEC-02",
    nombre: "Marcelo Rossi",
    especialidad: "Sistemas Neumáticos y Vacío",
    turno: "Tarde",
  },
  {
    id: 3,
    legajo: "TEC-03",
    nombre: "Hernán Aguirre",
    especialidad: "Electromecánica y Automatización",
    turno: "Rotativo",
  },
];

export const INITIAL_ORDENES_MANTENIMIENTO = [
  {
    id: "OM-2026-0040",
    maquinariaId: 1,
    maquinariaCodigo: "MAQ-001",
    maquinariaNombre: "Amasadora Espiral Industrial 50kg",
    tipo: "Preventivo",
    empleadoId: 1,
    tecnicoNombre: "Carlos Vignolo",
    fechaEmision: "2026-03-10",
    fechaInicio: "2026-03-10 18:30",
    fechaFin: "2026-03-10 20:15",
    estado: "Finalizada",
    descripcion:
      "Limpieza y lubricación de fin de jornada. Ajuste de tensión en correa trapezoidal motora y engrase de rodamientos de la bacha espiral con grasa de grado alimenticio NSF-H1.",
  },
  {
    id: "OM-2026-0041",
    maquinariaId: 2,
    maquinariaCodigo: "MAQ-002",
    maquinariaNombre: "Laminadora Calibradora de Masa Continua",
    tipo: "Preventivo",
    empleadoId: 3,
    tecnicoNombre: "Hernán Aguirre",
    fechaEmision: "2026-03-08",
    fechaInicio: "2026-03-08 19:00",
    fechaFin: "2026-03-08 21:00",
    estado: "Finalizada",
    descripcion:
      "Calibración milimétrica de rodillos con galga de espesores. Desarme de rascadores de teflón para limpieza de restos de masa deshidratada.",
  },
  {
    id: "OM-2026-0042",
    maquinariaId: 3,
    maquinariaCodigo: "MAQ-003",
    maquinariaNombre: "Rellenadora Automática de Ravioles & Sorrentinos",
    tipo: "Correctivo",
    empleadoId: 2,
    tecnicoNombre: "Marcelo Rossi",
    fechaEmision: "2026-03-12",
    fechaInicio: "2026-03-12 14:00",
    fechaFin: null,
    estado: "En Proceso",
    descripcion:
      "Desarme del dosificador de émbolo por pérdida de sellado en el cilindro neumático. Se detectó oring de silicona roto por fricción.",
  },
  {
    id: "OM-2026-0043",
    maquinariaId: 5,
    maquinariaCodigo: "MAQ-005",
    maquinariaNombre: "Envasadora al Vacío Doble Campana",
    tipo: "Correctivo",
    empleadoId: 2,
    tecnicoNombre: "Marcelo Rossi",
    fechaEmision: "2026-03-13",
    fechaInicio: "2026-03-13 08:30",
    fechaFin: null,
    estado: "En Proceso",
    descripcion:
      "Revisión por falla de vacío en campana derecha. Se verifica bobina quemada en válvula solenoide de descompresión rápida. Equipo con 28 hs de indisponibilidad.",
  },
  {
    id: "OM-2026-0044",
    maquinariaId: 7,
    maquinariaCodigo: "MAQ-007",
    maquinariaNombre: "Paila Volcable Cocinadora de Salsas 100L",
    tipo: "Preventivo",
    empleadoId: 1,
    tecnicoNombre: "Carlos Vignolo",
    fechaEmision: "2026-03-14",
    fechaInicio: null,
    fechaFin: null,
    estado: "Pendiente",
    descripcion:
      "Programado: Desarmar válvula esférica de desagote inferior, verificar estanqueidad de junta térmica y lubricar mecanismo basculante de descarga de salsa.",
  },
  {
    id: "OM-2026-0045",
    maquinariaId: 4,
    maquinariaCodigo: "MAQ-004",
    maquinariaNombre: "Cortadora Rotativa de Tallarines y Cintas",
    tipo: "Preventivo",
    empleadoId: 3,
    tecnicoNombre: "Hernán Aguirre",
    fechaEmision: "2026-03-02",
    fechaInicio: "2026-03-02 18:00",
    fechaFin: "2026-03-02 19:30",
    estado: "Finalizada",
    descripcion:
      "Desinfección integral y afilado de peine separador. Revisión de sensor inductivo de seguridad de tapa.",
  },
  {
    id: "OM-2026-0046",
    maquinariaId: 8,
    maquinariaCodigo: "MAQ-008",
    maquinariaNombre: "Formadora de Ñoquis Rotativa con Ranurado",
    tipo: "Correctivo",
    empleadoId: 1,
    tecnicoNombre: "Carlos Vignolo",
    fechaEmision: "2026-02-15",
    fechaInicio: null,
    fechaFin: null,
    estado: "Cancelada",
    descripcion:
      "Se canceló la intervención inmediata debido a que la producción de ñoquis se resolvió con máquina manual en el turno nocturno.",
  },
];

INITIAL_ORDENES_MANTENIMIENTO.forEach(order => {
  order.tareaRealizada = order.estado === 'Finalizada' ? order.descripcion : '';
});
