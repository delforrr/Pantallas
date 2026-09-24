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

export const PRODUCTOS_INICIALES = [
  {
    id: 'PRD-001',
    codigo: 'PRD-001',
    nombre: 'Ravioles de Ricota y Parmesano',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-001',
    recetaNombre: 'Ravioles de Ricota y Parmesano (10 kg)',
    presentacion: 'Caja x 1 kg',
    precioVenta: 5800,
    stockActual: 45,
    unidadMedida: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Ravioles artesanales con masa al huevo rellenos de ricota fresca de campo y parmesano estacionado.',
  },
  {
    id: 'PRD-002',
    codigo: 'PRD-002',
    nombre: 'Tallarines al Huevo Clásicos',
    categoria: 'Pastas Simples',
    recetaId: 'REC-002',
    recetaNombre: 'Tallarines al Huevo Clásicos (10 kg)',
    presentacion: 'Caja x 1 kg',
    precioVenta: 4200,
    stockActual: 60,
    unidadMedida: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Cintas tradicionales al huevo con sémola de trigo candeal de primera calidad.',
  },
  {
    id: 'PRD-003',
    codigo: 'PRD-003',
    nombre: 'Ravioles de Espinaca y Ricota',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-003',
    recetaNombre: 'Ravioles de Espinaca y Ricota (10 kg)',
    presentacion: 'Caja x 1 kg',
    precioVenta: 5600,
    stockActual: 30,
    unidadMedida: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Ravioles con espinaca fresca de huerta seleccionada y ricota cremosa.',
  },
  {
    id: 'PRD-004',
    codigo: 'PRD-004',
    nombre: 'Capeletis de Carne Braseada',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-004',
    recetaNombre: 'Capeletis de Carne Braseada (10 kg)',
    presentacion: 'Caja x 1 kg',
    precioVenta: 6400,
    stockActual: 25,
    unidadMedida: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Masa fina al huevo rellena de carne vacuna braseada lentamente con verduras.',
  },
  {
    id: 'PRD-005',
    codigo: 'PRD-005',
    nombre: 'Ñoquis de Papa Tradicionales',
    categoria: 'Pastas Simples',
    recetaId: 'REC-005',
    recetaNombre: 'Ñoquis de Papa Tradicionales (10 kg)',
    presentacion: 'Caja x 1 kg',
    precioVenta: 4500,
    stockActual: 40,
    unidadMedida: 'kg',
    vidaUtil: '24 hs fresco / 60 días freezer',
    estado: 'Activo',
    descripcion: 'Ñoquis suaves y livianos elaborados con papa natural y harina de trigo 0000.',
  },
  {
    id: 'PRD-006',
    codigo: 'PRD-006',
    nombre: 'Sorrentinos de Jamón y Mozzarella',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-006',
    recetaNombre: 'Sorrentinos de Jamón y Mozzarella (10 kg)',
    presentacion: 'Caja x 1 kg',
    precioVenta: 6200,
    stockActual: 20,
    unidadMedida: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Sorrentinos redondos con abundancia de jamón cocido seleccionado y mozzarella suave.',
  },
  {
    id: 'PRD-007',
    codigo: 'PRD-007',
    nombre: 'Cintas al Huevo con Espinaca',
    categoria: 'Pastas Simples',
    recetaId: null,
    recetaNombre: 'Sin receta asignada',
    presentacion: 'Caja x 1 kg',
    precioVenta: 4400,
    stockActual: 15,
    unidadMedida: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Inactivo',
    descripcion: 'Pasta cinta verde al huevo coloreada con espinaca natural molida.',
  },
  {
    id: 'PRD-008',
    codigo: 'PRD-008',
    nombre: 'Canelones de Verdura y Ricota',
    categoria: 'Pastas Rellenas',
    recetaId: null,
    recetaNombre: 'Sin receta asignada',
    presentacion: 'Bandeja x 6 un',
    precioVenta: 5900,
    stockActual: 0,
    unidadMedida: 'unidades',
    vidaUtil: '48 hs refrigerado',
    estado: 'Inactivo',
    descripcion: 'Canelones armados listos para hornear con salsa a elección.',
  },
  {
    id: 'PRD-009',
    codigo: 'PRD-009',
    nombre: 'Salsa Filetto Artesanal',
    categoria: 'Otros',
    recetaId: null,
    recetaNombre: 'No requiere (Producto listo / reventa)',
    presentacion: 'Pote x 500g',
    precioVenta: 2800,
    stockActual: 35,
    unidadMedida: 'unidades',
    vidaUtil: '15 días refrigerado',
    estado: 'Activo',
    descripcion: 'Salsa de tomates frescos seleccionados con albahaca y aceite de oliva virgen extra.',
  },
  {
    id: 'PRD-010',
    codigo: 'PRD-010',
    nombre: 'Queso Reggianito Rallado',
    categoria: 'Otros',
    recetaId: null,
    recetaNombre: 'No requiere (Producto listo / reventa)',
    presentacion: 'Pote x 200g',
    precioVenta: 3500,
    stockActual: 50,
    unidadMedida: 'unidades',
    vidaUtil: '60 días refrigerado',
    estado: 'Activo',
    descripcion: 'Queso reggianito de pasta dura estacionado, envasado al vacío en hebras.',
  },
  {
    id: 'PRD-011',
    codigo: 'PRD-011',
    nombre: 'Tiramisú Tradicional Italiano',
    categoria: 'Otros',
    recetaId: null,
    recetaNombre: 'No requiere (Producto listo / reventa)',
    presentacion: 'Copa x 250g',
    precioVenta: 3200,
    stockActual: 18,
    unidadMedida: 'unidades',
    vidaUtil: '5 días refrigerado',
    estado: 'Activo',
    descripcion: 'Postre italiano con vainillas al café expreso, crema de mascarpone y cacao amargo.',
  },
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
    responsable: 'Juan Carlos Pérez (Jefe de Cuadra)',
    turno: 'Mañana (06:00 - 14:00)',
    estado: 'Planificada', // Planificada, En Proceso, Finalizada, Cancelada
    estadoInsumos: 'Completo', // Completo, Faltante
    notaPedidoId: 'NP-2026-001',
    items: [
      { recetaId: 'REC-001', productoNombre: 'Ravioles de Ricota y Parmesano', cantidadKilos: 50 },
      { recetaId: 'REC-002', productoNombre: 'Tallarines al Huevo Clásicos', cantidadKilos: 20 },
    ],
    cantidadKilos: 70,
    productoNombre: 'Ravioles de Ricota y Parmesano + 1 más',
    solicitudCompraGenerada: false,
    insumosFaltantes: [],
    observaciones: 'Programada al cierre de jornada para primera hora del turno mañana.',
  },
  {
    id: 'OP-2026-002',
    numero: 'OP #102',
    fechaEmision: '2026-09-14',
    fechaProgramada: '2026-09-15',
    responsable: 'María Laura Gómez',
    turno: 'Tarde (14:00 - 22:00)',
    estado: 'Planificada',
    estadoInsumos: 'Faltante', // Genera orden de compra de insumo chico
    notaPedidoId: 'NP-2026-002',
    items: [
      { recetaId: 'REC-003', productoNombre: 'Ravioles de Espinaca y Ricota', cantidadKilos: 40 },
    ],
    cantidadKilos: 40,
    productoNombre: 'Ravioles de Espinaca y Ricota',
    solicitudCompraGenerada: true,
    ordenCompraLocalId: 'OC-LOC-042',
    proveedorSugerido: 'Quinta Don Pedro (Local)',
    insumosFaltantes: [
      { nombre: 'Espinaca Fresca Seleccionada', requerido: 10, disponible: 12, faltante: 0, unidad: 'kg' },
      { nombre: 'Ricota Fresca Entera', requerido: 12, disponible: 28, faltante: 0, unidad: 'kg' },
    ],
    observaciones: 'Faltante detectado de insumos frescos. Se generó solicitud a compras para proveedor local.',
  },
  {
    id: 'OP-2026-003',
    numero: 'OP #100',
    fechaEmision: '2026-09-13',
    fechaProgramada: '2026-09-14',
    responsable: 'Juan Carlos Pérez',
    turno: 'Mañana (06:00 - 14:00)',
    estado: 'Finalizada',
    estadoInsumos: 'Completo',
    notaPedidoId: 'NP-2026-000',
    items: [
      { recetaId: 'REC-002', productoNombre: 'Tallarines al Huevo Clásicos', cantidadKilos: 60 },
    ],
    cantidadKilos: 60,
    productoNombre: 'Tallarines al Huevo Clásicos',
    solicitudCompraGenerada: false,
    insumosFaltantes: [],
    observaciones: 'Lote finalizado en tiempo y forma sin desvíos de merma.',
  },
  {
    id: 'OP-2026-004',
    numero: 'OP #103',
    fechaEmision: '2026-09-14',
    fechaProgramada: '2026-09-15',
    responsable: 'Esteban Morales',
    turno: 'Mañana (06:00 - 14:00)',
    estado: 'En Proceso',
    estadoInsumos: 'Completo',
    notaPedidoId: 'NP-2026-003',
    items: [
      { recetaId: 'REC-004', productoNombre: 'Capeletis de Carne Braseada', cantidadKilos: 30 },
    ],
    cantidadKilos: 30,
    productoNombre: 'Capeletis de Carne Braseada',
    solicitudCompraGenerada: false,
    insumosFaltantes: [],
    observaciones: 'Elaboración en amasadora N° 2 iniciada según cronograma.',
  },
  {
    id: 'OP-2026-005',
    numero: 'OP #104',
    fechaEmision: '2026-09-14',
    fechaProgramada: '2026-09-15',
    responsable: 'María Laura Gómez',
    turno: 'Tarde (14:00 - 22:00)',
    estado: 'Cancelada',
    estadoInsumos: 'Completo',
    notaPedidoId: 'NP-2026-004',
    items: [
      { recetaId: 'REC-001', productoNombre: 'Ravioles de Ricota y Parmesano', cantidadKilos: 20 },
    ],
    cantidadKilos: 20,
    productoNombre: 'Ravioles de Ricota y Parmesano',
    solicitudCompraGenerada: false,
    insumosFaltantes: [],
    observaciones: 'Cancelada por cambio de prioridad en pedido especial de banquetes.',
  },
];

// Función utilitaria para calcular la materia prima requerida dada una receta y cantidad en kg
export const calcularInsumosRequeridos = (receta, cantidadKilos) => {
  if (!receta || !receta.ingredientes) return [];
  const factor = cantidadKilos / (receta.rendimientoBase || 10);
  return receta.ingredientes.map((ing) => ({
    ...ing,
    cantidadRequerida: Number((ing.cantidad * factor).toFixed(2)),
  }));
};

// Verifica la disponibilidad de insumos en stock comparando con las materias primas para una sola receta
export const verificarDisponibilidadInsumos = (receta, cantidadKilos, inventario = MATERIAS_PRIMAS_INICIALES) => {
  if (!receta || !receta.ingredientes) return { insumos: [], hayFaltante: false, faltantes: [] };
  const requeridos = calcularInsumosRequeridos(receta, cantidadKilos);

  const insumos = requeridos.map((req) => {
    const mp = inventario.find((item) => item.id === req.materiaPrimaId || item.nombre.toLowerCase() === req.nombre.toLowerCase());
    const stockActual = mp ? mp.stockActual : 0;
    const falta = Math.max(0, Number((req.cantidadRequerida - stockActual).toFixed(2)));
    const esFaltante = falta > 0;

    return {
      ...req,
      stockActual,
      faltante: falta,
      esFaltante,
      unidad: req.unidad || (mp ? mp.unidad : 'kg'),
      proveedorSugerido: mp ? mp.proveedorSugerido : 'Proveedor Local Sugerido',
      tipo: mp ? mp.tipo : 'Insumo',
    };
  });

  const faltantes = insumos.filter((i) => i.esFaltante);
  return {
    insumos,
    hayFaltante: faltantes.length > 0,
    faltantes,
  };
};

// Verifica la disponibilidad consolidada de insumos para una orden con múltiples productos a elaborar
export const verificarDisponibilidadMultiplesProductos = (
  items = [],
  recetas = RECETAS_INICIALES,
  inventario = MATERIAS_PRIMAS_INICIALES
) => {
  if (!items || items.length === 0) {
    return { insumos: [], hayFaltante: false, faltantes: [], totalKilos: 0 };
  }

  const mapaInsumos = {};
  let totalKilos = 0;

  items.forEach((item) => {
    const kilos = Number(item.cantidadKilos) || 0;
    totalKilos += kilos;
    const receta = recetas.find((r) => r.id === item.recetaId || r.nombreProducto === item.productoNombre);
    if (!receta || !receta.ingredientes) return;

    const factor = kilos / (receta.rendimientoBase || 10);
    receta.ingredientes.forEach((ing) => {
      const id = ing.materiaPrimaId || ing.nombre;
      if (!mapaInsumos[id]) {
        mapaInsumos[id] = {
          materiaPrimaId: ing.materiaPrimaId,
          nombre: ing.nombre,
          unidad: ing.unidad,
          cantidadRequerida: 0,
        };
      }
      mapaInsumos[id].cantidadRequerida += ing.cantidad * factor;
    });
  });

  const insumos = Object.values(mapaInsumos).map((req) => {
    const cantReq = Number(req.cantidadRequerida.toFixed(2));
    const mp = inventario.find(
      (item) => item.id === req.materiaPrimaId || item.nombre.toLowerCase() === req.nombre.toLowerCase()
    );
    const stockActual = mp ? mp.stockActual : 0;
    const falta = Math.max(0, Number((cantReq - stockActual).toFixed(2)));
    const esFaltante = falta > 0;

    return {
      ...req,
      cantidadRequerida: cantReq,
      stockActual,
      faltante: falta,
      esFaltante,
      unidad: req.unidad || (mp ? mp.unidad : 'kg'),
      proveedorSugerido: mp ? mp.proveedorSugerido : 'Proveedor Local Sugerido',
      tipo: mp ? mp.tipo : 'Insumo',
    };
  });

  const faltantes = insumos.filter((i) => i.esFaltante);
  return {
    insumos,
    hayFaltante: faltantes.length > 0,
    faltantes,
    totalKilos: Number(totalKilos.toFixed(2)),
  };
};


