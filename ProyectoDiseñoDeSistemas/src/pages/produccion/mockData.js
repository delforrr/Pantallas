// Datos iniciales para el módulo de Producción

export const PRODUCTOS_FABRICABLES = [
  { codigo: 'PRD-001', nombre: 'Ravioles de Ricota y Parmesano', categoria: 'Pastas Rellenas' },
  { codigo: 'PRD-002', nombre: 'Tallarines al Huevo Clásicos', categoria: 'Pastas Simples' },
  { codigo: 'PRD-003', nombre: 'Ravioles de Espinaca y Ricota', categoria: 'Pastas Rellenas' },
  { codigo: 'PRD-004', nombre: 'Capeletis de Carne Braseada', categoria: 'Pastas Rellenas' },
  { codigo: 'PRD-005', nombre: 'Ñoquis de Papa Tradicionales', categoria: 'Pastas Simples' },
  { codigo: 'PRD-006', nombre: 'Sorrentinos de Jamón y Mozzarella', categoria: 'Pastas Rellenas' },
  { codigo: 'PRD-007', nombre: 'Cintas al Huevo con Espinaca', categoria: 'Pastas Simples' },
  { codigo: 'PRD-008', nombre: 'Canelones de Verdura y Ricota', categoria: 'Pastas Rellenas' },
];

export const MATERIAS_PRIMAS_INICIALES = [
  {
    id: 'MP-001',
    codigo: 'HAR-001',
    nombre: 'Harina de Trigo 0000',
    tipo: 'Harinas y Cereales',
    unidad: 'kg',
    stockActual: 350,
    stockMinimo: 100,
    proveedorSugerido: 'Molino Cañuelas',
    precioUnitario: 850,
  },
  {
    id: 'MP-002',
    codigo: 'SEM-002',
    nombre: 'Sémola de Trigo Candeal',
    tipo: 'Harinas y Cereales',
    unidad: 'kg',
    stockActual: 80,
    stockMinimo: 50,
    proveedorSugerido: 'Molino Campodónico',
    precioUnitario: 1200,
  },
  {
    id: 'MP-003',
    codigo: 'HUE-003',
    nombre: 'Huevos de Campo',
    tipo: 'Frescos y Granja',
    unidad: 'docenas',
    stockActual: 45,
    stockMinimo: 30,
    proveedorSugerido: 'Granja San Antonio',
    precioUnitario: 2400,
  },
  {
    id: 'MP-004',
    codigo: 'RIC-004',
    nombre: 'Ricota Fresca Entera',
    tipo: 'Lácteos',
    unidad: 'kg',
    stockActual: 28,
    stockMinimo: 40, // Faltante / bajo stock
    proveedorSugerido: 'Lácteos La Serranita',
    precioUnitario: 3200,
  },
  {
    id: 'MP-005',
    codigo: 'PAR-005',
    nombre: 'Queso Parmesano Rallado',
    tipo: 'Lácteos',
    unidad: 'kg',
    stockActual: 15,
    stockMinimo: 10,
    proveedorSugerido: 'Lácteos La Serranita',
    precioUnitario: 9800,
  },
  {
    id: 'MP-006',
    codigo: 'ESP-006',
    nombre: 'Espinaca Fresca Seleccionada',
    tipo: 'Verduras',
    unidad: 'kg',
    stockActual: 12,
    stockMinimo: 20, // Faltante / bajo stock
    proveedorSugerido: 'Quinta Don Pedro (Local)',
    precioUnitario: 1800,
  },
  {
    id: 'MP-007',
    codigo: 'CAR-007',
    nombre: 'Carne Vacuna Picada Especial',
    tipo: 'Carnes',
    unidad: 'kg',
    stockActual: 30,
    stockMinimo: 15,
    proveedorSugerido: 'Frigorífico Regional',
    precioUnitario: 6500,
  },
  {
    id: 'MP-008',
    codigo: 'SAL-008',
    nombre: 'Sal Refinada Fina',
    tipo: 'Condimentos',
    unidad: 'kg',
    stockActual: 60,
    stockMinimo: 15,
    proveedorSugerido: 'Distribuidora Alimentos Sur',
    precioUnitario: 450,
  },
  {
    id: 'MP-009',
    codigo: 'NUE-009',
    nombre: 'Nuez Moscada Molida',
    tipo: 'Condimentos',
    unidad: 'kg',
    stockActual: 2.5,
    stockMinimo: 1.0,
    proveedorSugerido: 'Especias El Trébol (Local)',
    precioUnitario: 18000,
  },
  {
    id: 'MP-010',
    codigo: 'CAJ-010',
    nombre: 'Cajas Térmicas 1 kg (Packaging)',
    tipo: 'Packaging',
    unidad: 'unidades',
    stockActual: 250,
    stockMinimo: 150,
    proveedorSugerido: 'Envases del Plata (Local)',
    precioUnitario: 350,
  },
];

export const RECETAS_INICIALES = [
  {
    id: 'REC-001',
    codigoProducto: 'PRD-001',
    nombreProducto: 'Ravioles de Ricota y Parmesano',
    categoria: 'Pastas Rellenas',
    rendimientoBase: 10, // kg
    tiempoElaboracionMin: 90,
    ingredientes: [
      { materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 4.5, unidad: 'kg' },
      { materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 2.5, unidad: 'docenas' },
      { materiaPrimaId: 'MP-004', nombre: 'Ricota Fresca Entera', cantidad: 4.0, unidad: 'kg' },
      { materiaPrimaId: 'MP-005', nombre: 'Queso Parmesano Rallado', cantidad: 1.0, unidad: 'kg' },
      { materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
  },
  {
    id: 'REC-002',
    codigoProducto: 'PRD-002',
    nombreProducto: 'Tallarines al Huevo Clásicos',
    categoria: 'Pastas Simples',
    rendimientoBase: 10, // kg
    tiempoElaboracionMin: 60,
    ingredientes: [
      { materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 7.0, unidad: 'kg' },
      { materiaPrimaId: 'MP-002', nombre: 'Sémola de Trigo Candeal', cantidad: 2.0, unidad: 'kg' },
      { materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 4.0, unidad: 'docenas' },
      { materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
  },
  {
    id: 'REC-003',
    codigoProducto: 'PRD-003',
    nombreProducto: 'Ravioles de Espinaca y Ricota',
    categoria: 'Pastas Rellenas',
    rendimientoBase: 10, // kg
    tiempoElaboracionMin: 100,
    ingredientes: [
      { materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 4.5, unidad: 'kg' },
      { materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 2.5, unidad: 'docenas' },
      { materiaPrimaId: 'MP-004', nombre: 'Ricota Fresca Entera', cantidad: 3.0, unidad: 'kg' },
      { materiaPrimaId: 'MP-006', nombre: 'Espinaca Fresca Seleccionada', cantidad: 2.5, unidad: 'kg' },
      { materiaPrimaId: 'MP-005', nombre: 'Queso Parmesano Rallado', cantidad: 0.8, unidad: 'kg' },
      { materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
  },
  {
    id: 'REC-004',
    codigoProducto: 'PRD-004',
    nombreProducto: 'Capeletis de Carne Braseada',
    categoria: 'Pastas Rellenas',
    rendimientoBase: 10, // kg
    tiempoElaboracionMin: 120,
    ingredientes: [
      { materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 5.0, unidad: 'kg' },
      { materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 3.0, unidad: 'docenas' },
      { materiaPrimaId: 'MP-007', nombre: 'Carne Vacuna Picada Especial', cantidad: 3.5, unidad: 'kg' },
      { materiaPrimaId: 'MP-005', nombre: 'Queso Parmesano Rallado', cantidad: 0.5, unidad: 'kg' },
      { materiaPrimaId: 'MP-009', nombre: 'Nuez Moscada Molida', cantidad: 0.05, unidad: 'kg' },
      { materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
  },
];

export const ORDENES_PRODUCCION_INICIALES = [
  {
    id: 'OP-2026-001',
    numero: 'OP #101',
    fechaEmision: '2026-09-14',
    fechaProgramada: '2026-09-15', // Fabricación al día siguiente
    productoId: 'REC-001',
    productoNombre: 'Ravioles de Ricota y Parmesano',
    cantidadKilos: 50,
    responsable: 'Juan Carlos Pérez (Jefe de Cuadra)',
    turno: 'Mañana (06:00 - 14:00)',
    estado: 'Planificada', // Planificada, En Proceso, Finalizada, Cancelada
    estadoInsumos: 'Completo', // Completo, Faltante
    notaPedidoId: 'NP-2026-001',
    observaciones: 'Programada al cierre de jornada para producción matutina.',
  },
  {
    id: 'OP-2026-002',
    numero: 'OP #102',
    fechaEmision: '2026-09-14',
    fechaProgramada: '2026-09-15',
    productoId: 'REC-003',
    productoNombre: 'Ravioles de Espinaca y Ricota',
    cantidadKilos: 40,
    responsable: 'María Laura Gómez',
    turno: 'Tarde (14:00 - 22:00)',
    estado: 'Planificada',
    estadoInsumos: 'Faltante', // Genera orden de compra de insumo chico
    notaPedidoId: 'NP-2026-002',
    observaciones: 'Faltante de Espinaca y Ricota en stock. Se emitió solicitud a compras.',
  },
  {
    id: 'OP-2026-003',
    numero: 'OP #100',
    fechaEmision: '2026-09-13',
    fechaProgramada: '2026-09-14',
    productoId: 'REC-002',
    productoNombre: 'Tallarines al Huevo Clásicos',
    cantidadKilos: 60,
    responsable: 'Juan Carlos Pérez',
    turno: 'Mañana (06:00 - 14:00)',
    estado: 'Finalizada',
    estadoInsumos: 'Completo',
    notaPedidoId: 'NP-2026-000',
    observaciones: 'Lote finalizado sin desvíos de merma.',
  },
];

// Función utilitaria para calcular la materia prima requerida dada una receta y cantidad en kg
export const calcularInsumosRequeridos = (receta, cantidadKilos) => {
  if (!receta || !receta.ingredientes) return [];
  const factor = cantidadKilos / receta.rendimientoBase;
  return receta.ingredientes.map((ing) => ({
    ...ing,
    cantidadRequerida: Number((ing.cantidad * factor).toFixed(2)),
  }));
};
