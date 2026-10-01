// Datos iniciales para el módulo de Producción adaptados al Diagrama de Clases del Dominio

// -------------------------------------------------------------
// CATALOGOS MAESTROS DEL DIAGRAMA DE CLASES
// -------------------------------------------------------------

// Clase: TipoDeProducto (IdTipoDeProducto, TipoProducto)
export const TIPOS_PRODUCTO = [
  { idTipoDeProducto: 1, tipoProducto: 'Pastas Rellenas' },
  { idTipoDeProducto: 2, tipoProducto: 'Pastas Simples' },
  { idTipoDeProducto: 3, tipoProducto: 'Otros' },
];

// Clase: Producto (IdProducto, Producto)
export const PRODUCTOS_BASE = [
  { idProducto: 1, producto: 'Ravioles' },
  { idProducto: 2, producto: 'Tallarines' },
  { idProducto: 3, producto: 'Capeletis' },
  { idProducto: 4, producto: 'Ñoquis' },
  { idProducto: 5, producto: 'Sorrentinos' },
  { idProducto: 6, producto: 'Cintas' },
  { idProducto: 7, producto: 'Canelones' },
  { idProducto: 8, producto: 'Salsa Filetto' },
  { idProducto: 9, producto: 'Queso Reggianito' },
  { idProducto: 10, producto: 'Tiramisú' },
];

// Clase: Variedad (IdVariedad, Variedad)
export const VARIEDADES = [
  { idVariedad: 1, variedad: 'Ricota y Parmesano' },
  { idVariedad: 2, variedad: 'Al Huevo Clásicos' },
  { idVariedad: 3, variedad: 'Espinaca y Ricota' },
  { idVariedad: 4, variedad: 'Carne Braseada' },
  { idVariedad: 5, variedad: 'De Papa Tradicionales' },
  { idVariedad: 6, variedad: 'Jamón y Mozzarella' },
  { idVariedad: 7, variedad: 'Con Espinaca' },
  { idVariedad: 8, variedad: 'Verdura y Ricota' },
  { idVariedad: 9, variedad: 'Artesanal' },
  { idVariedad: 10, variedad: 'Rallado' },
  { idVariedad: 11, variedad: 'Tradicional Italiano' },
];

// Clase: Unidad (IdUnidad, Unidad)
export const UNIDADES = [
  { idUnidad: 1, unidad: 'kg' },
  { idUnidad: 2, unidad: 'unidades' },
  { idUnidad: 3, unidad: 'docenas' },
];

// Clase: Empleado (IdEmpleado, Nombre, Cargo)
export const EMPLEADOS = [
  { idEmpleado: 1, nombre: 'Juan Carlos Pérez', cargo: 'Jefe de Cuadra' },
  { idEmpleado: 2, nombre: 'María Laura Gómez', cargo: 'Operaria de Cuadra' },
  { idEmpleado: 3, nombre: 'Esteban Morales', cargo: 'Maquinista de Cuadra' },
  { idEmpleado: 4, nombre: 'Gonzalo Fernández', cargo: 'Auxiliar de Cuadra' },
];

// Clase: Maquinaria (IdMaquinaria, Descripcion)
export const MAQUINARIAS = [
  { idMaquinaria: 1, codigo: 'MAQ-001', descripcion: 'Amasadora Industrial Rápida N° 1 (50 kg)', tipo: 'Amasado' },
  { idMaquinaria: 2, codigo: 'MAQ-002', descripcion: 'Amasadora Industrial N° 2 (100 kg)', tipo: 'Amasado' },
  { idMaquinaria: 3, codigo: 'MAQ-003', descripcion: 'Laminadora / Sobadora Continua L-1', tipo: 'Laminado' },
  { idMaquinaria: 4, codigo: 'MAQ-004', descripcion: 'Raviolera Automática Continua R-50', tipo: 'Moldeado' },
  { idMaquinaria: 5, codigo: 'MAQ-005', descripcion: 'Cortadora / Fideera Automática C-30', tipo: 'Corte' },
  { idMaquinaria: 6, codigo: 'MAQ-006', descripcion: 'Ñoquetera / Formadora de Ñoquis N-20', tipo: 'Formado' },
  { idMaquinaria: 7, codigo: 'MAQ-007', descripcion: 'Sorrentinera Neumática S-40', tipo: 'Moldeado' },
  { idMaquinaria: 8, codigo: 'MAQ-008', descripcion: 'Pastera Combinada Multipropósito P-10', tipo: 'Combinada' },
];

// Alias para compatibilidad con código existente
export const MAQUINARIAS_TABULADAS = MAQUINARIAS.map((m) => ({
  ...m,
  id: m.codigo,
  nombre: m.descripcion,
}));

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

// -------------------------------------------------------------
// Clase: ProductoCompuesto (IdProducto, IdStock, IdTipoDeProducto, IdUnidad, IdVariedad, PrecioUnitario)
// -------------------------------------------------------------
export const PRODUCTOS_INICIALES = [
  {
    id: 'PRD-001',
    codigo: 'PRD-001',
    idProductoCompuesto: 1,
    idProducto: 1, // Ravioles
    idTipoDeProducto: 1, // Pastas Rellenas
    idVariedad: 1, // Ricota y Parmesano
    idUnidad: 1, // kg
    idStock: 101,
    precioUnitario: 5800,
    precioVenta: 5800,
    stockActual: 45,
    stockMinimo: 15,
    unidadMedida: 'kg',
    nombre: 'Ravioles de Ricota y Parmesano',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-001',
    recetaNombre: 'Ravioles de Ricota y Parmesano (10 kg)',
    unidad: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Ravioles artesanales con masa al huevo rellenos de ricota fresca de campo y parmesano estacionado.',
  },
  {
    id: 'PRD-002',
    codigo: 'PRD-002',
    idProductoCompuesto: 2,
    idProducto: 2, // Tallarines
    idTipoDeProducto: 2, // Pastas Simples
    idVariedad: 2, // Al Huevo Clásicos
    idUnidad: 1, // kg
    idStock: 102,
    precioUnitario: 4200,
    precioVenta: 4200,
    stockActual: 60,
    stockMinimo: 20,
    unidadMedida: 'kg',
    nombre: 'Tallarines al Huevo Clásicos',
    categoria: 'Pastas Simples',
    recetaId: 'REC-002',
    recetaNombre: 'Tallarines al Huevo Clásicos (10 kg)',
    unidad: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Cintas tradicionales al huevo con sémola de trigo candeal de primera calidad.',
  },
  {
    id: 'PRD-003',
    codigo: 'PRD-003',
    idProductoCompuesto: 3,
    idProducto: 1, // Ravioles
    idTipoDeProducto: 1, // Pastas Rellenas
    idVariedad: 3, // Espinaca y Ricota
    idUnidad: 1, // kg
    idStock: 103,
    precioUnitario: 5600,
    precioVenta: 5600,
    stockActual: 30,
    stockMinimo: 15,
    unidadMedida: 'kg',
    nombre: 'Ravioles de Espinaca y Ricota',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-003',
    recetaNombre: 'Ravioles de Espinaca y Ricota (10 kg)',
    unidad: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Ravioles con espinaca fresca de huerta seleccionada y ricota cremosa.',
  },
  {
    id: 'PRD-004',
    codigo: 'PRD-004',
    idProductoCompuesto: 4,
    idProducto: 3, // Capeletis
    idTipoDeProducto: 1, // Pastas Rellenas
    idVariedad: 4, // Carne Braseada
    idUnidad: 1, // kg
    idStock: 104,
    precioUnitario: 6400,
    precioVenta: 6400,
    stockActual: 25,
    stockMinimo: 10,
    unidadMedida: 'kg',
    nombre: 'Capeletis de Carne Braseada',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-004',
    recetaNombre: 'Capeletis de Carne Braseada (10 kg)',
    unidad: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Masa fina al huevo rellena de carne vacuna braseada lentamente con verduras.',
  },
  {
    id: 'PRD-005',
    codigo: 'PRD-005',
    idProductoCompuesto: 5,
    idProducto: 4, // Ñoquis
    idTipoDeProducto: 2, // Pastas Simples
    idVariedad: 5, // De Papa Tradicionales
    idUnidad: 1, // kg
    idStock: 105,
    precioUnitario: 4500,
    precioVenta: 4500,
    stockActual: 40,
    stockMinimo: 15,
    unidadMedida: 'kg',
    nombre: 'Ñoquis de Papa Tradicionales',
    categoria: 'Pastas Simples',
    recetaId: 'REC-005',
    recetaNombre: 'Ñoquis de Papa Tradicionales (10 kg)',
    unidad: 'kg',
    vidaUtil: '24 hs fresco / 60 días freezer',
    estado: 'Activo',
    descripcion: 'Ñoquis suaves y livianos elaborados con papa natural y harina de trigo 0000.',
  },
  {
    id: 'PRD-006',
    codigo: 'PRD-006',
    idProductoCompuesto: 6,
    idProducto: 5, // Sorrentinos
    idTipoDeProducto: 1, // Pastas Rellenas
    idVariedad: 6, // Jamón y Mozzarella
    idUnidad: 1, // kg
    idStock: 106,
    precioUnitario: 6200,
    precioVenta: 6200,
    stockActual: 20,
    stockMinimo: 15,
    unidadMedida: 'kg',
    nombre: 'Sorrentinos de Jamón y Mozzarella',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-006',
    recetaNombre: 'Sorrentinos de Jamón y Mozzarella (10 kg)',
    unidad: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: 'Sorrentinos redondos con abundancia de jamón cocido seleccionado y mozzarella suave.',
  },
  {
    id: 'PRD-007',
    codigo: 'PRD-007',
    idProductoCompuesto: 7,
    idProducto: 6, // Cintas
    idTipoDeProducto: 2, // Pastas Simples
    idVariedad: 7, // Con Espinaca
    idUnidad: 1, // kg
    idStock: 107,
    precioUnitario: 4400,
    precioVenta: 4400,
    stockActual: 15,
    stockMinimo: 15,
    unidadMedida: 'kg',
    nombre: 'Cintas al Huevo con Espinaca',
    categoria: 'Pastas Simples',
    recetaId: null,
    recetaNombre: 'Sin receta asignada',
    unidad: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Inactivo',
    descripcion: 'Pasta cinta verde al huevo coloreada con espinaca natural molida.',
  },
  {
    id: 'PRD-008',
    codigo: 'PRD-008',
    idProductoCompuesto: 8,
    idProducto: 7, // Canelones
    idTipoDeProducto: 1, // Pastas Rellenas
    idVariedad: 8, // Verdura y Ricota
    idUnidad: 2, // unidades
    idStock: 108,
    precioUnitario: 5900,
    precioVenta: 5900,
    stockActual: 0,
    stockMinimo: 10,
    unidadMedida: 'unidades',
    nombre: 'Canelones de Verdura y Ricota',
    categoria: 'Pastas Rellenas',
    recetaId: null,
    recetaNombre: 'Sin receta asignada',
    unidad: 'unidades',
    vidaUtil: '48 hs refrigerado',
    estado: 'Inactivo',
    descripcion: 'Canelones armados listos para hornear con salsa a elección.',
  },
  {
    id: 'PRD-009',
    codigo: 'PRD-009',
    idProductoCompuesto: 9,
    idProducto: 8, // Salsa Filetto
    idTipoDeProducto: 3, // Otros
    idVariedad: 9, // Artesanal
    idUnidad: 2, // unidades
    idStock: 109,
    precioUnitario: 2800,
    precioVenta: 2800,
    stockActual: 35,
    stockMinimo: 12,
    unidadMedida: 'unidades',
    nombre: 'Salsa Filetto Artesanal',
    categoria: 'Otros',
    recetaId: null,
    recetaNombre: 'No requiere (Producto listo / reventa)',
    unidad: 'unidades',
    vidaUtil: '15 días refrigerado',
    estado: 'Activo',
    descripcion: 'Salsa de tomates frescos seleccionados con albahaca y aceite de oliva virgen extra.',
  },
  {
    id: 'PRD-010',
    codigo: 'PRD-010',
    idProductoCompuesto: 10,
    idProducto: 9, // Queso Reggianito
    idTipoDeProducto: 3, // Otros
    idVariedad: 10, // Rallado
    idUnidad: 2, // unidades
    idStock: 110,
    precioUnitario: 3500,
    precioVenta: 3500,
    stockActual: 50,
    stockMinimo: 15,
    unidadMedida: 'unidades',
    nombre: 'Queso Reggianito Rallado',
    categoria: 'Otros',
    recetaId: null,
    recetaNombre: 'No requiere (Producto listo / reventa)',
    unidad: 'unidades',
    vidaUtil: '60 días refrigerado',
    estado: 'Activo',
    descripcion: 'Queso reggianito de pasta dura estacionado, envasado al vacío en hebras.',
  },
  {
    id: 'PRD-011',
    codigo: 'PRD-011',
    idProductoCompuesto: 11,
    idProducto: 10, // Tiramisú
    idTipoDeProducto: 3, // Otros
    idVariedad: 11, // Tradicional Italiano
    idUnidad: 2, // unidades
    idStock: 111,
    precioUnitario: 3200,
    precioVenta: 3200,
    stockActual: 18,
    stockMinimo: 10,
    unidadMedida: 'unidades',
    nombre: 'Tiramisú Tradicional Italiano',
    categoria: 'Otros',
    recetaId: null,
    recetaNombre: 'No requiere (Producto listo / reventa)',
    unidad: 'unidades',
    vidaUtil: '5 días refrigerado',
    estado: 'Activo',
    descripcion: 'Postre italiano con vainillas al café expreso, crema de mascarpone y cacao amargo.',
  },
];

// -------------------------------------------------------------
// Clase: MateriaPrima (IdMateriaPrima, Nombre, Descripcion, Marca, IdStock, IdUnidad)
// -------------------------------------------------------------
export const MATERIAS_PRIMAS_INICIALES = [
  {
    id: 'MP-001',
    codigo: 'MP-001',
    idMateriaPrima: 1,
    nombre: 'Harina de Trigo 0000',
    descripcion: 'Harina pura de trigo pan 0000 sin aditivos químicos, apta para elaboración de pastas al huevo.',
    marca: 'Molino Cañuelas',
    idStock: 201,
    idUnidad: 1, // kg
    unidad: 'kg',
    stockActual: 350,
    stockMinimo: 100,
    tipo: 'Harinas y Cereales',
    estado: 'Activo',
  },
  {
    id: 'MP-002',
    codigo: 'MP-002',
    idMateriaPrima: 2,
    nombre: 'Sémola de Trigo Candeal',
    descripcion: 'Sémola pura de trigo candeal de granulometría fina para masa al dente.',
    marca: 'Molino Campodónico',
    idStock: 202,
    idUnidad: 1, // kg
    unidad: 'kg',
    stockActual: 80,
    stockMinimo: 50,
    tipo: 'Harinas y Cereales',
    estado: 'Activo',
  },
  {
    id: 'MP-003',
    codigo: 'MP-003',
    idMateriaPrima: 3,
    nombre: 'Huevos de Campo',
    descripcion: 'Huevos frescos de gallinas libres de jaula, tamaño grande con control sanitario al día.',
    marca: 'Granja San Antonio',
    idStock: 203,
    idUnidad: 3, // docenas
    unidad: 'docenas',
    stockActual: 45,
    stockMinimo: 30,
    tipo: 'Frescos y Granja',
    estado: 'Activo',
  },
  {
    id: 'MP-004',
    codigo: 'MP-004',
    idMateriaPrima: 4,
    nombre: 'Ricota Fresca Entera',
    descripcion: 'Ricota magra de pasta suave y homogénea, pasteurizada para relleno de ravioles y sorrentinos.',
    marca: 'Lácteos La Serranita',
    idStock: 204,
    idUnidad: 1, // kg
    unidad: 'kg',
    stockActual: 28,
    stockMinimo: 40, // Bajo stock
    tipo: 'Lácteos',
    estado: 'Activo',
  },
  {
    id: 'MP-005',
    codigo: 'MP-005',
    idMateriaPrima: 5,
    nombre: 'Queso Parmesano Rallado',
    descripcion: 'Queso de pasta dura madurado 12 meses, rallado fino para condimentación de rellenos.',
    marca: 'Lácteos La Serranita',
    idStock: 205,
    idUnidad: 1, // kg
    unidad: 'kg',
    stockActual: 15,
    stockMinimo: 10,
    tipo: 'Lácteos',
    estado: 'Activo',
  },
  {
    id: 'MP-006',
    codigo: 'MP-006',
    idMateriaPrima: 6,
    nombre: 'Espinaca Fresca Seleccionada',
    descripcion: 'Espinaca fresca de hoja tierna, lavada y despalillada para relleno de pastas verdes.',
    marca: 'Quinta Don Pedro (Local)',
    idStock: 206,
    idUnidad: 1, // kg
    unidad: 'kg',
    stockActual: 12,
    stockMinimo: 20, // Bajo stock
    tipo: 'Verduras',
    estado: 'Activo',
  },
  {
    id: 'MP-007',
    codigo: 'MP-007',
    idMateriaPrima: 7,
    nombre: 'Carne Vacuna Picada Especial',
    descripcion: 'Carne magra de novillo picada de primera calidad sin exceso de grasa.',
    marca: 'Frigorífico Regional',
    idStock: 207,
    idUnidad: 1, // kg
    unidad: 'kg',
    stockActual: 30,
    stockMinimo: 15,
    tipo: 'Carnes',
    estado: 'Activo',
  },
  {
    id: 'MP-008',
    codigo: 'MP-008',
    idMateriaPrima: 8,
    nombre: 'Sal Refinada Fina',
    descripcion: 'Sal fina enriquecida con yodo para formulación de masas y caldos.',
    marca: 'Dos Anclas',
    idStock: 208,
    idUnidad: 1, // kg
    unidad: 'kg',
    stockActual: 60,
    stockMinimo: 15,
    tipo: 'Condimentos',
    estado: 'Activo',
  },
  {
    id: 'MP-009',
    codigo: 'MP-009',
    idMateriaPrima: 9,
    nombre: 'Nuez Moscada Molida',
    descripcion: 'Especia molida aromática de primera selección para aromatizar rellenos de ricota.',
    marca: 'Especias El Trébol',
    idStock: 209,
    idUnidad: 1, // kg
    unidad: 'kg',
    stockActual: 2.5,
    stockMinimo: 1.0,
    tipo: 'Condimentos',
    estado: 'Activo',
  },
  {
    id: 'MP-010',
    codigo: 'MP-010',
    idMateriaPrima: 10,
    nombre: 'Cajas Térmicas 1 kg (Packaging)',
    descripcion: 'Envases de poliestireno expandido con tapa hermética para despacho de pastas frescas.',
    marca: 'Envases del Plata',
    idStock: 210,
    idUnidad: 2, // unidades
    unidad: 'unidades',
    stockActual: 250,
    stockMinimo: 150,
    tipo: 'Packaging',
    estado: 'Activo',
  },
];

// -------------------------------------------------------------
// Clase: Receta (IdReceta, Cantidad, Pasos, IdMateriaPrima)
// Clase: DetalleReceta (IdReceta, IdMateriaPrima, Cantidad)
// -------------------------------------------------------------
export const RECETAS_INICIALES = [
  {
    id: 'REC-001',
    idReceta: 1,
    codigoProducto: 'PRD-001',
    idProducto: 1,
    idTipoDeProducto: 1,
    idVariedad: 1,
    nombreProducto: 'Ravioles de Ricota y Parmesano',
    categoria: 'Pastas Rellenas',
    cantidad: 10, // Cantidad en kg de rendimiento según diagrama
    rendimientoBase: 10,
    pasos: [
      'Pesar y tamizar la harina de trigo 0000 con la sal fina en tolva de carga.',
      'Incorporar los huevos de campo y amasar en amasadora rápida durante 12 minutos hasta masa elástica y sin vetas.',
      'Dejar descansar el empaste tapado en cámara de reposo a 18°C durante 20 minutos.',
      'Pasar por sobadora/laminadora continua en graduación decreciente hasta calibrar lámina de 1.2 mm.',
      'Preparar el relleno homogeneizando la ricota fresca entera con el queso parmesano rallado y condimentos.',
      'Alimentar la raviolera automática continua, verificar dosificación y sellado perimetral de planchas.',
      'Orear 15 minutos en bandejas perforadas y fraccionar en cajas térmicas de 1 kg etiquetadas con lote y vencimiento.',
    ],
    tiempoElaboracionMin: 90,
    detalles: [
      { idReceta: 1, idMateriaPrima: 1, materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 4.5, unidad: 'kg' },
      { idReceta: 1, idMateriaPrima: 3, materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 2.5, unidad: 'docenas' },
      { idReceta: 1, idMateriaPrima: 4, materiaPrimaId: 'MP-004', nombre: 'Ricota Fresca Entera', cantidad: 4.0, unidad: 'kg' },
      { idReceta: 1, idMateriaPrima: 5, materiaPrimaId: 'MP-005', nombre: 'Queso Parmesano Rallado', cantidad: 1.0, unidad: 'kg' },
      { idReceta: 1, idMateriaPrima: 8, materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { idReceta: 1, idMateriaPrima: 10, materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
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
    idReceta: 2,
    codigoProducto: 'PRD-002',
    idProducto: 2,
    idTipoDeProducto: 2,
    idVariedad: 2,
    nombreProducto: 'Tallarines al Huevo Clásicos',
    categoria: 'Pastas Simples',
    cantidad: 10,
    rendimientoBase: 10,
    pasos: [
      'Pesar y combinar la harina 0000 con la sémola de trigo candeal y sal fina.',
      'Agregar huevos de campo e iniciar amasado enérgico por 15 minutos hasta consistencia firme.',
      'Laminar y sobar con múltiples pliegues en sobadora hasta lograr textura sedosa y tenacidad al dente.',
      'Pasar las láminas por cortadora/fideera automática con peine de cinta fina de 4 mm.',
      'Conformar nidos tradicionales de 100g y envasar en cajas térmicas de 1 kg refrigeradas.',
    ],
    tiempoElaboracionMin: 60,
    detalles: [
      { idReceta: 2, idMateriaPrima: 1, materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 7.0, unidad: 'kg' },
      { idReceta: 2, idMateriaPrima: 2, materiaPrimaId: 'MP-002', nombre: 'Sémola de Trigo Candeal', cantidad: 2.0, unidad: 'kg' },
      { idReceta: 2, idMateriaPrima: 3, materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 4.0, unidad: 'docenas' },
      { idReceta: 2, idMateriaPrima: 8, materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { idReceta: 2, idMateriaPrima: 10, materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
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
    idReceta: 3,
    codigoProducto: 'PRD-003',
    idProducto: 1,
    idTipoDeProducto: 1,
    idVariedad: 3,
    nombreProducto: 'Ravioles de Espinaca y Ricota',
    categoria: 'Pastas Rellenas',
    cantidad: 10,
    rendimientoBase: 10,
    pasos: [
      'Blanquear la espinaca fresca seleccionada, centrifugar y procesar finamente sin excedente de líquido.',
      'Integrar la espinaca procesada con harina 0000 y huevos en amasadora rápida hasta color verde parejo.',
      'Descansar la masa tapada y laminar en sobadora continua hasta espesor uniforme de 1.2 mm.',
      'Elaborar relleno cremoso uniendo ricota fresca, queso parmesano rallado y condimentos.',
      'Moldear en raviolera automática continua con control de dosificación constante de relleno.',
      'Orear 15 minutos en secadero y envasar en cajas térmicas de 1 kg con control de peso exacto.',
    ],
    tiempoElaboracionMin: 100,
    detalles: [
      { idReceta: 3, idMateriaPrima: 1, materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 4.5, unidad: 'kg' },
      { idReceta: 3, idMateriaPrima: 3, materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 2.5, unidad: 'docenas' },
      { idReceta: 3, idMateriaPrima: 4, materiaPrimaId: 'MP-004', nombre: 'Ricota Fresca Entera', cantidad: 3.0, unidad: 'kg' },
      { idReceta: 3, idMateriaPrima: 6, materiaPrimaId: 'MP-006', nombre: 'Espinaca Fresca Seleccionada', cantidad: 2.5, unidad: 'kg' },
      { idReceta: 3, idMateriaPrima: 5, materiaPrimaId: 'MP-005', nombre: 'Queso Parmesano Rallado', cantidad: 0.8, unidad: 'kg' },
      { idReceta: 3, idMateriaPrima: 8, materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { idReceta: 3, idMateriaPrima: 10, materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
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
    idReceta: 4,
    codigoProducto: 'PRD-004',
    idProducto: 3,
    idTipoDeProducto: 1,
    idVariedad: 4,
    nombreProducto: 'Capeletis de Carne Braseada',
    categoria: 'Pastas Rellenas',
    cantidad: 10,
    rendimientoBase: 10,
    pasos: [
      'Brasear la carne vacuna picada especial a fuego lento, enfriar y procesar con condimentos y nuez moscada.',
      'Elaborar masa al huevo firme en amasadora durante 15 minutos hasta lograr textura suave.',
      'Laminar en sobadora continua calibrando a 1.0 mm de espesor uniforme.',
      'Dosificar el relleno de carne, cortar discos y plegar en capeletis tradicionales en conformadora.',
      'Espolvorear con lluvia de sémola antiadherente y envasar en cajas térmicas de 1 kg.',
    ],
    tiempoElaboracionMin: 120,
    detalles: [
      { idReceta: 4, idMateriaPrima: 1, materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 5.0, unidad: 'kg' },
      { idReceta: 4, idMateriaPrima: 3, materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 3.0, unidad: 'docenas' },
      { idReceta: 4, idMateriaPrima: 7, materiaPrimaId: 'MP-007', nombre: 'Carne Vacuna Picada Especial', cantidad: 3.5, unidad: 'kg' },
      { idReceta: 4, idMateriaPrima: 5, materiaPrimaId: 'MP-005', nombre: 'Queso Parmesano Rallado', cantidad: 0.5, unidad: 'kg' },
      { idReceta: 4, idMateriaPrima: 9, materiaPrimaId: 'MP-009', nombre: 'Nuez Moscada Molida', cantidad: 0.05, unidad: 'kg' },
      { idReceta: 4, idMateriaPrima: 10, materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
    ingredientes: [
      { materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 5.0, unidad: 'kg' },
      { materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 3.0, unidad: 'docenas' },
      { materiaPrimaId: 'MP-007', nombre: 'Carne Vacuna Picada Especial', cantidad: 3.5, unidad: 'kg' },
      { materiaPrimaId: 'MP-005', nombre: 'Queso Parmesano Rallado', cantidad: 0.5, unidad: 'kg' },
      { materiaPrimaId: 'MP-009', nombre: 'Nuez Moscada Molida', cantidad: 0.05, unidad: 'kg' },
      { materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
  },
  {
    id: 'REC-005',
    idReceta: 5,
    codigoProducto: 'PRD-005',
    idProducto: 4,
    idTipoDeProducto: 2,
    idVariedad: 5,
    nombreProducto: 'Ñoquis de Papa Tradicionales',
    categoria: 'Pastas Simples',
    cantidad: 10,
    rendimientoBase: 10,
    pasos: [
      'Hervir papas con piel, pelar en caliente y procesar en pasapuré industrial.',
      'Enfriar el puré a 30°C e incorporar harina 0000, huevo y sal sin sobreamasar.',
      'Alimentar la ñoquera extrusora automática para corte y acanalado tradicional.',
      'Orear en bandejas ventiladas durante 10 minutos y envasar en cajas de 1 kg.',
    ],
    tiempoElaboracionMin: 75,
    detalles: [
      { idReceta: 5, idMateriaPrima: 1, materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 3.0, unidad: 'kg' },
      { idReceta: 5, idMateriaPrima: 3, materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 1.5, unidad: 'docenas' },
      { idReceta: 5, idMateriaPrima: 8, materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { idReceta: 5, idMateriaPrima: 10, materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
    ingredientes: [
      { materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 3.0, unidad: 'kg' },
      { materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 1.5, unidad: 'docenas' },
      { materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
  },
  {
    id: 'REC-006',
    idReceta: 6,
    codigoProducto: 'PRD-006',
    idProducto: 5,
    idTipoDeProducto: 1,
    idVariedad: 6,
    nombreProducto: 'Sorrentinos de Jamón y Mozzarella',
    categoria: 'Pastas Rellenas',
    cantidad: 10,
    rendimientoBase: 10,
    pasos: [
      'Amasar harina 0000 con huevos y agua purificada durante 14 minutos.',
      'Laminar láminas anchas en sobadora continua hasta 1.3 mm de espesor uniforme.',
      'Procesar jamón cocido seleccionado e incorporar a la mozzarella homogénea con condimentos.',
      'Moldear en sorrentinera circular de 5 cm de diámetro con cierre reforzado.',
      'Orear 15 minutos en secadero y envasar en cajas térmicas de 1 kg con separadores antiadherentes.',
    ],
    tiempoElaboracionMin: 95,
    detalles: [
      { idReceta: 6, idMateriaPrima: 1, materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 4.5, unidad: 'kg' },
      { idReceta: 6, idMateriaPrima: 3, materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 2.5, unidad: 'docenas' },
      { idReceta: 6, idMateriaPrima: 8, materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { idReceta: 6, idMateriaPrima: 10, materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
    ingredientes: [
      { materiaPrimaId: 'MP-001', nombre: 'Harina de Trigo 0000', cantidad: 4.5, unidad: 'kg' },
      { materiaPrimaId: 'MP-003', nombre: 'Huevos de Campo', cantidad: 2.5, unidad: 'docenas' },
      { materiaPrimaId: 'MP-008', nombre: 'Sal Refinada Fina', cantidad: 0.1, unidad: 'kg' },
      { materiaPrimaId: 'MP-010', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 10, unidad: 'unidades' },
    ],
  },
];

// -------------------------------------------------------------
// Clase: OrdenDeProduccion (FechaEmision, FechaInicio, FechaFin, IdEmpleado, IdOrdenProduccion)
// Clase: MaquinariaProduccion (IdMaquinaria, IdOrdenProduccion)
// Clase: DetalleOrdenDeProduccion (CantidadPlanificada, CantidadProducida, IdOrdenProduccion, IdProducto, IdTipoDeProducto, IdVariedad)
// Clase: NotaPedidoMateriaPrima (FechaEmision, IdNotaPedidoMP, IdOrdenProduccion)
// Clase: DetalleNotaPedidoMateriaPrima (Cantidad, IdMateriaPrima, IdNotaPedidoMP)
// -------------------------------------------------------------
export const ORDENES_PRODUCCION_INICIALES = [
  {
    id: 'OP-2026-001',
    idOrdenProduccion: 1,
    numero: 'OP #101',
    fechaEmision: '2026-09-14',
    fechaInicio: '2026-09-15',
    fechaFin: '2026-09-15',
    fechaProgramada: '2026-09-15',
    idEmpleado: 1,
    empleadoNombre: 'Juan Carlos Pérez (Jefe de Cuadra)',
    responsable: 'Juan Carlos Pérez (Jefe de Cuadra)',
    turno: 'Mañana (06:00 - 14:00)',
    maquinariaProduccion: [
      { idOrdenProduccion: 1, idMaquinaria: 1, codigo: 'MAQ-001', descripcion: 'Amasadora Industrial Rápida N° 1 (50 kg)', tipo: 'Amasado' },
      { idOrdenProduccion: 1, idMaquinaria: 3, codigo: 'MAQ-003', descripcion: 'Laminadora / Sobadora Continua L-1', tipo: 'Laminado' },
      { idOrdenProduccion: 1, idMaquinaria: 4, codigo: 'MAQ-004', descripcion: 'Raviolera Automática Continua R-50', tipo: 'Moldeado' },
      { idOrdenProduccion: 1, idMaquinaria: 5, codigo: 'MAQ-005', descripcion: 'Cortadora / Fideera Automática C-30', tipo: 'Corte' },
    ],
    maquinasIds: [1, 3, 4, 5],
    maquinaId: 'MAQ-001, MAQ-003, MAQ-004, MAQ-005',
    maquinaNombre: 'Amasadora N° 1, Sobadora L-1, Raviolera R-50, Fideera C-30',
    estado: 'Planificada', // Planificada, En Proceso, Finalizada, Cancelada
    estadoInsumos: 'Completo',
    notaPedidoId: 'NP-2026-001',
    notaPedidoMateriaPrima: {
      idNotaPedidoMP: 1,
      fechaEmision: '2026-09-14',
      idOrdenProduccion: 1,
      detalles: [
        { idNotaPedidoMP: 1, idMateriaPrima: 1, materiaPrimaNombre: 'Harina de Trigo 0000', cantidad: 36.5, unidad: 'kg' },
        { idNotaPedidoMP: 1, idMateriaPrima: 3, materiaPrimaNombre: 'Huevos de Campo', cantidad: 20.5, unidad: 'docenas' },
        { idNotaPedidoMP: 1, idMateriaPrima: 4, materiaPrimaNombre: 'Ricota Fresca Entera', cantidad: 20.0, unidad: 'kg' },
        { idNotaPedidoMP: 1, idMateriaPrima: 5, materiaPrimaNombre: 'Queso Parmesano Rallado', cantidad: 5.0, unidad: 'kg' },
      ],
    },
    detallesOrdenProduccion: [
      {
        idOrdenProduccion: 1,
        idProducto: 1,
        idTipoDeProducto: 1,
        idVariedad: 1,
        cantidadPlanificada: 50,
        cantidadProducida: 0,
        recetaId: 'REC-001',
        productoNombre: 'Ravioles de Ricota y Parmesano',
        cantidadKilos: 50,
      },
      {
        idOrdenProduccion: 1,
        idProducto: 2,
        idTipoDeProducto: 2,
        idVariedad: 2,
        cantidadPlanificada: 20,
        cantidadProducida: 0,
        recetaId: 'REC-002',
        productoNombre: 'Tallarines al Huevo Clásicos',
        cantidadKilos: 20,
      },
    ],
    items: [
      { idProducto: 1, idTipoDeProducto: 1, idVariedad: 1, cantidadPlanificada: 50, cantidadProducida: 0, recetaId: 'REC-001', productoNombre: 'Ravioles de Ricota y Parmesano', cantidadKilos: 50 },
      { idProducto: 2, idTipoDeProducto: 2, idVariedad: 2, cantidadPlanificada: 20, cantidadProducida: 0, recetaId: 'REC-002', productoNombre: 'Tallarines al Huevo Clásicos', cantidadKilos: 20 },
    ],
    cantidadKilos: 70,
    productoNombre: 'Ravioles de Ricota y Parmesano + 1 más',
    solicitudCompraGenerada: false,
    insumosFaltantes: [],
    observaciones: 'Programada al cierre de jornada para primera hora del turno mañana.',
  },
  {
    id: 'OP-2026-002',
    idOrdenProduccion: 2,
    numero: 'OP #102',
    fechaEmision: '2026-09-14',
    fechaInicio: '2026-09-15',
    fechaFin: '2026-09-15',
    fechaProgramada: '2026-09-15',
    idEmpleado: 2,
    empleadoNombre: 'María Laura Gómez',
    responsable: 'María Laura Gómez',
    turno: 'Tarde (14:00 - 22:00)',
    maquinariaProduccion: [
      { idOrdenProduccion: 2, idMaquinaria: 1, codigo: 'MAQ-001', descripcion: 'Amasadora Industrial Rápida N° 1 (50 kg)', tipo: 'Amasado' },
      { idOrdenProduccion: 2, idMaquinaria: 3, codigo: 'MAQ-003', descripcion: 'Laminadora / Sobadora Continua L-1', tipo: 'Laminado' },
      { idOrdenProduccion: 2, idMaquinaria: 4, codigo: 'MAQ-004', descripcion: 'Raviolera Automática Continua R-50', tipo: 'Moldeado' },
    ],
    maquinasIds: [1, 3, 4],
    maquinaId: 'MAQ-001, MAQ-003, MAQ-004',
    maquinaNombre: 'Amasadora N° 1, Sobadora L-1, Raviolera R-50',
    estado: 'Planificada',
    estadoInsumos: 'Faltante',
    notaPedidoId: 'NP-2026-002',
    notaPedidoMateriaPrima: {
      idNotaPedidoMP: 2,
      fechaEmision: '2026-09-14',
      idOrdenProduccion: 2,
      detalles: [
        { idNotaPedidoMP: 2, idMateriaPrima: 6, materiaPrimaNombre: 'Espinaca Fresca Seleccionada', cantidad: 10.0, unidad: 'kg' },
        { idNotaPedidoMP: 2, idMateriaPrima: 4, materiaPrimaNombre: 'Ricota Fresca Entera', cantidad: 12.0, unidad: 'kg' },
      ],
    },
    detallesOrdenProduccion: [
      {
        idOrdenProduccion: 2,
        idProducto: 1,
        idTipoDeProducto: 1,
        idVariedad: 3,
        cantidadPlanificada: 40,
        cantidadProducida: 0,
        recetaId: 'REC-003',
        productoNombre: 'Ravioles de Espinaca y Ricota',
        cantidadKilos: 40,
      },
    ],
    items: [
      { idProducto: 1, idTipoDeProducto: 1, idVariedad: 3, cantidadPlanificada: 40, cantidadProducida: 0, recetaId: 'REC-003', productoNombre: 'Ravioles de Espinaca y Ricota', cantidadKilos: 40 },
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
    idOrdenProduccion: 3,
    numero: 'OP #100',
    fechaEmision: '2026-09-13',
    fechaInicio: '2026-09-14',
    fechaFin: '2026-09-14',
    fechaProgramada: '2026-09-14',
    idEmpleado: 1,
    empleadoNombre: 'Juan Carlos Pérez',
    responsable: 'Juan Carlos Pérez',
    turno: 'Mañana (06:00 - 14:00)',
    maquinariaProduccion: [
      { idOrdenProduccion: 3, idMaquinaria: 2, codigo: 'MAQ-002', descripcion: 'Amasadora Industrial N° 2 (100 kg)', tipo: 'Amasado' },
      { idOrdenProduccion: 3, idMaquinaria: 3, codigo: 'MAQ-003', descripcion: 'Laminadora / Sobadora Continua L-1', tipo: 'Laminado' },
      { idOrdenProduccion: 3, idMaquinaria: 5, codigo: 'MAQ-005', descripcion: 'Cortadora / Fideera Automática C-30', tipo: 'Corte' },
    ],
    maquinasIds: [2, 3, 5],
    maquinaId: 'MAQ-002, MAQ-003, MAQ-005',
    maquinaNombre: 'Amasadora N° 2, Sobadora L-1, Fideera C-30',
    estado: 'Finalizada',
    estadoInsumos: 'Completo',
    notaPedidoId: 'NP-2026-000',
    notaPedidoMateriaPrima: {
      idNotaPedidoMP: 3,
      fechaEmision: '2026-09-13',
      idOrdenProduccion: 3,
      detalles: [
        { idNotaPedidoMP: 3, idMateriaPrima: 1, materiaPrimaNombre: 'Harina de Trigo 0000', cantidad: 42.0, unidad: 'kg' },
        { idNotaPedidoMP: 3, idMateriaPrima: 2, materiaPrimaNombre: 'Sémola de Trigo Candeal', cantidad: 12.0, unidad: 'kg' },
      ],
    },
    detallesOrdenProduccion: [
      {
        idOrdenProduccion: 3,
        idProducto: 2,
        idTipoDeProducto: 2,
        idVariedad: 2,
        cantidadPlanificada: 60,
        cantidadProducida: 60,
        recetaId: 'REC-002',
        productoNombre: 'Tallarines al Huevo Clásicos',
        cantidadKilos: 60,
      },
    ],
    items: [
      { idProducto: 2, idTipoDeProducto: 2, idVariedad: 2, cantidadPlanificada: 60, cantidadProducida: 60, recetaId: 'REC-002', productoNombre: 'Tallarines al Huevo Clásicos', cantidadKilos: 60 },
    ],
    cantidadKilos: 60,
    productoNombre: 'Tallarines al Huevo Clásicos',
    solicitudCompraGenerada: false,
    insumosFaltantes: [],
    observaciones: 'Lote finalizado en tiempo y forma sin desvíos de merma.',
  },
  {
    id: 'OP-2026-004',
    idOrdenProduccion: 4,
    numero: 'OP #103',
    fechaEmision: '2026-09-14',
    fechaInicio: '2026-09-15',
    fechaFin: '2026-09-15',
    fechaProgramada: '2026-09-15',
    idEmpleado: 3,
    empleadoNombre: 'Esteban Morales',
    responsable: 'Esteban Morales',
    turno: 'Mañana (06:00 - 14:00)',
    maquinariaProduccion: [
      { idOrdenProduccion: 4, idMaquinaria: 2, codigo: 'MAQ-002', descripcion: 'Amasadora Industrial N° 2 (100 kg)', tipo: 'Amasado' },
      { idOrdenProduccion: 4, idMaquinaria: 8, codigo: 'MAQ-008', descripcion: 'Pastera Combinada Multipropósito P-10', tipo: 'Combinada' },
    ],
    maquinasIds: [2, 8],
    maquinaId: 'MAQ-002, MAQ-008',
    maquinaNombre: 'Amasadora N° 2, Pastera Combinada P-10',
    estado: 'En Proceso',
    estadoInsumos: 'Completo',
    notaPedidoId: 'NP-2026-003',
    notaPedidoMateriaPrima: {
      idNotaPedidoMP: 4,
      fechaEmision: '2026-09-14',
      idOrdenProduccion: 4,
      detalles: [
        { idNotaPedidoMP: 4, idMateriaPrima: 7, materiaPrimaNombre: 'Carne Vacuna Picada Especial', cantidad: 10.5, unidad: 'kg' },
      ],
    },
    detallesOrdenProduccion: [
      {
        idOrdenProduccion: 4,
        idProducto: 3,
        idTipoDeProducto: 1,
        idVariedad: 4,
        cantidadPlanificada: 30,
        cantidadProducida: 15,
        recetaId: 'REC-004',
        productoNombre: 'Capeletis de Carne Braseada',
        cantidadKilos: 30,
      },
    ],
    items: [
      { idProducto: 3, idTipoDeProducto: 1, idVariedad: 4, cantidadPlanificada: 30, cantidadProducida: 15, recetaId: 'REC-004', productoNombre: 'Capeletis de Carne Braseada', cantidadKilos: 30 },
    ],
    cantidadKilos: 30,
    productoNombre: 'Capeletis de Carne Braseada',
    solicitudCompraGenerada: false,
    insumosFaltantes: [],
    observaciones: 'Elaboración en amasadora N° 2 iniciada según cronograma.',
  },
  {
    id: 'OP-2026-005',
    idOrdenProduccion: 5,
    numero: 'OP #104',
    fechaEmision: '2026-09-14',
    fechaInicio: '2026-09-15',
    fechaFin: '2026-09-15',
    fechaProgramada: '2026-09-15',
    idEmpleado: 2,
    empleadoNombre: 'María Laura Gómez',
    responsable: 'María Laura Gómez',
    turno: 'Tarde (14:00 - 22:00)',
    maquinariaProduccion: [
      { idOrdenProduccion: 5, idMaquinaria: 1, codigo: 'MAQ-001', descripcion: 'Amasadora Industrial Rápida N° 1 (50 kg)', tipo: 'Amasado' },
      { idOrdenProduccion: 5, idMaquinaria: 4, codigo: 'MAQ-004', descripcion: 'Raviolera Automática Continua R-50', tipo: 'Moldeado' },
    ],
    maquinasIds: [1, 4],
    maquinaId: 'MAQ-001, MAQ-004',
    maquinaNombre: 'Amasadora N° 1, Raviolera R-50',
    estado: 'Cancelada',
    estadoInsumos: 'Completo',
    notaPedidoId: 'NP-2026-004',
    notaPedidoMateriaPrima: {
      idNotaPedidoMP: 5,
      fechaEmision: '2026-09-14',
      idOrdenProduccion: 5,
      detalles: [
        { idNotaPedidoMP: 5, idMateriaPrima: 1, materiaPrimaNombre: 'Harina de Trigo 0000', nombre: 'Harina de Trigo 0000', cantidad: 9.0, cantidadRequerida: 9.0, unidad: 'kg' },
        { idNotaPedidoMP: 5, idMateriaPrima: 3, materiaPrimaNombre: 'Huevos de Campo', nombre: 'Huevos de Campo', cantidad: 5.0, cantidadRequerida: 5.0, unidad: 'docenas' },
        { idNotaPedidoMP: 5, idMateriaPrima: 4, materiaPrimaNombre: 'Ricota Fresca Entera', nombre: 'Ricota Fresca Entera', cantidad: 8.0, cantidadRequerida: 8.0, unidad: 'kg' },
        { idNotaPedidoMP: 5, idMateriaPrima: 5, materiaPrimaNombre: 'Queso Parmesano Rallado', nombre: 'Queso Parmesano Rallado', cantidad: 2.0, cantidadRequerida: 2.0, unidad: 'kg' },
        { idNotaPedidoMP: 5, idMateriaPrima: 8, materiaPrimaNombre: 'Sal Refinada Fina', nombre: 'Sal Refinada Fina', cantidad: 0.2, cantidadRequerida: 0.2, unidad: 'kg' },
        { idNotaPedidoMP: 5, idMateriaPrima: 10, materiaPrimaNombre: 'Cajas Térmicas 1 kg (Packaging)', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 20, cantidadRequerida: 20, unidad: 'unidades' },
      ],
    },
    detallesOrdenProduccion: [
      {
        idOrdenProduccion: 5,
        idProducto: 1,
        idTipoDeProducto: 1,
        idVariedad: 1,
        cantidadPlanificada: 20,
        cantidadProducida: 0,
        recetaId: 'REC-001',
        productoNombre: 'Ravioles de Ricota y Parmesano',
        cantidadKilos: 20,
      },
    ],
    items: [
      { idProducto: 1, idTipoDeProducto: 1, idVariedad: 1, cantidadPlanificada: 20, cantidadProducida: 0, recetaId: 'REC-001', productoNombre: 'Ravioles de Ricota y Parmesano', cantidadKilos: 20 },
    ],
    cantidadKilos: 20,
    productoNombre: 'Ravioles de Ricota y Parmesano',
    solicitudCompraGenerada: false,
    insumosFaltantes: [],
    observaciones: 'Cancelada por cambio de prioridad en pedido especial de banquetes.',
  },
];

// -------------------------------------------------------------
// Clase: NotaPedidoMateriaPrima (IdNotaPedidoMP, NumeroNP, FechaEmision, IdOrdenProduccion, EstadoInsumos)
// Clase: DetalleNotaPedidoMateriaPrima (IdNotaPedidoMP, IdMateriaPrima, Cantidad, Unidad)
// -------------------------------------------------------------
export const NOTAS_PEDIDO_MP_INICIALES = [
  {
    idNotaPedidoMP: 1,
    numeroNP: 'NP-2026-001',
    idOrdenProduccion: 1,
    ordenNumero: 'OP #101',
    fechaEmision: '2026-09-14',
    turno: 'Mañana (06:00 - 14:00)',
    idEmpleado: 1,
    empleadoNombre: 'Juan Carlos Pérez (Jefe de Cuadra)',
    responsable: 'Juan Carlos Pérez (Jefe de Cuadra)',
    estadoInsumos: 'Completo',
    detalles: [
      { idNotaPedidoMP: 1, idMateriaPrima: 1, materiaPrimaNombre: 'Harina de Trigo 0000', cantidad: 36.5, unidad: 'kg' },
      { idNotaPedidoMP: 1, idMateriaPrima: 3, materiaPrimaNombre: 'Huevos de Campo', cantidad: 20.5, unidad: 'docenas' },
      { idNotaPedidoMP: 1, idMateriaPrima: 4, materiaPrimaNombre: 'Ricota Fresca Entera', cantidad: 20.0, unidad: 'kg' },
      { idNotaPedidoMP: 1, idMateriaPrima: 5, materiaPrimaNombre: 'Queso Parmesano Rallado', cantidad: 5.0, unidad: 'kg' },
    ],
  },
  {
    idNotaPedidoMP: 2,
    numeroNP: 'NP-2026-002',
    idOrdenProduccion: 2,
    ordenNumero: 'OP #102',
    fechaEmision: '2026-09-14',
    turno: 'Tarde (14:00 - 22:00)',
    idEmpleado: 2,
    empleadoNombre: 'María Laura Gómez',
    responsable: 'María Laura Gómez',
    estadoInsumos: 'Faltante',
    detalles: [
      { idNotaPedidoMP: 2, idMateriaPrima: 6, materiaPrimaNombre: 'Espinaca Fresca Seleccionada', cantidad: 10.0, unidad: 'kg' },
      { idNotaPedidoMP: 2, idMateriaPrima: 4, materiaPrimaNombre: 'Ricota Fresca Entera', cantidad: 12.0, unidad: 'kg' },
    ],
  },
  {
    idNotaPedidoMP: 3,
    numeroNP: 'NP-2026-000',
    idOrdenProduccion: 3,
    ordenNumero: 'OP #100',
    fechaEmision: '2026-09-13',
    turno: 'Mañana (06:00 - 14:00)',
    idEmpleado: 1,
    empleadoNombre: 'Juan Carlos Pérez',
    responsable: 'Juan Carlos Pérez',
    estadoInsumos: 'Completo',
    detalles: [
      { idNotaPedidoMP: 3, idMateriaPrima: 1, materiaPrimaNombre: 'Harina de Trigo 0000', cantidad: 42.0, unidad: 'kg' },
      { idNotaPedidoMP: 3, idMateriaPrima: 2, materiaPrimaNombre: 'Sémola de Trigo Candeal', cantidad: 12.0, unidad: 'kg' },
    ],
  },
  {
    idNotaPedidoMP: 4,
    numeroNP: 'NP-2026-003',
    idOrdenProduccion: 4,
    ordenNumero: 'OP #103',
    fechaEmision: '2026-09-14',
    turno: 'Mañana (06:00 - 14:00)',
    idEmpleado: 3,
    empleadoNombre: 'Esteban Morales',
    responsable: 'Esteban Morales',
    estadoInsumos: 'Completo',
    detalles: [
      { idNotaPedidoMP: 4, idMateriaPrima: 7, materiaPrimaNombre: 'Carne Vacuna Picada Especial', cantidad: 10.5, unidad: 'kg' },
    ],
  },
  {
    idNotaPedidoMP: 5,
    numeroNP: 'NP-2026-004',
    idOrdenProduccion: 5,
    ordenNumero: 'OP #104',
    fechaEmision: '2026-09-14',
    turno: 'Tarde (14:00 - 22:00)',
    idEmpleado: 2,
    empleadoNombre: 'María Laura Gómez',
    responsable: 'María Laura Gómez',
    estadoInsumos: 'Completo',
    detalles: [
      { idNotaPedidoMP: 5, idMateriaPrima: 1, materiaPrimaNombre: 'Harina de Trigo 0000', nombre: 'Harina de Trigo 0000', cantidad: 9.0, cantidadRequerida: 9.0, unidad: 'kg' },
      { idNotaPedidoMP: 5, idMateriaPrima: 3, materiaPrimaNombre: 'Huevos de Campo', nombre: 'Huevos de Campo', cantidad: 5.0, cantidadRequerida: 5.0, unidad: 'docenas' },
      { idNotaPedidoMP: 5, idMateriaPrima: 4, materiaPrimaNombre: 'Ricota Fresca Entera', nombre: 'Ricota Fresca Entera', cantidad: 8.0, cantidadRequerida: 8.0, unidad: 'kg' },
      { idNotaPedidoMP: 5, idMateriaPrima: 5, materiaPrimaNombre: 'Queso Parmesano Rallado', nombre: 'Queso Parmesano Rallado', cantidad: 2.0, cantidadRequerida: 2.0, unidad: 'kg' },
      { idNotaPedidoMP: 5, idMateriaPrima: 8, materiaPrimaNombre: 'Sal Refinada Fina', nombre: 'Sal Refinada Fina', cantidad: 0.2, cantidadRequerida: 0.2, unidad: 'kg' },
      { idNotaPedidoMP: 5, idMateriaPrima: 10, materiaPrimaNombre: 'Cajas Térmicas 1 kg (Packaging)', nombre: 'Cajas Térmicas 1 kg (Packaging)', cantidad: 20, cantidadRequerida: 20, unidad: 'unidades' },
    ],
  },
];

// Función utilitaria para calcular la materia prima requerida dada una receta y cantidad en kg
export const calcularInsumosRequeridos = (receta, cantidadKilos) => {
  if (!receta || (!receta.detalles && !receta.ingredientes)) return [];
  const lista = receta.detalles || receta.ingredientes;
  const factor = cantidadKilos / (receta.rendimientoBase || receta.cantidad || 10);
  return lista.map((ing) => ({
    ...ing,
    cantidadRequerida: Number(((ing.cantidad || ing.cantidadRequerida) * factor).toFixed(2)),
  }));
};

// Verifica la disponibilidad de insumos en stock comparando con las materias primas para una sola receta
export const verificarDisponibilidadInsumos = (receta, cantidadKilos, inventario = MATERIAS_PRIMAS_INICIALES) => {
  if (!receta || (!receta.detalles && !receta.ingredientes)) return { insumos: [], hayFaltante: false, faltantes: [] };
  const requeridos = calcularInsumosRequeridos(receta, cantidadKilos);

  const insumos = requeridos.map((req) => {
    const mp = inventario.find(
      (item) => item.id === req.materiaPrimaId || item.idMateriaPrima === req.idMateriaPrima || item.nombre?.toLowerCase() === (req.nombre || req.materiaPrimaNombre)?.toLowerCase()
    );
    const stockActual = mp ? mp.stockActual : 0;
    const falta = Math.max(0, Number((req.cantidadRequerida - stockActual).toFixed(2)));
    const esFaltante = falta > 0;

    return {
      ...req,
      idMateriaPrima: req.idMateriaPrima || (mp ? mp.idMateriaPrima : null),
      nombre: req.nombre || req.materiaPrimaNombre || (mp ? mp.nombre : 'Insumo'),
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
    const kilos = Number(item.cantidadKilos || item.cantidadPlanificada) || 0;
    totalKilos += kilos;
    const receta = recetas.find(
      (r) => r.id === item.recetaId || r.idReceta === item.idReceta || r.nombreProducto === item.productoNombre
    );
    if (!receta) return;
    const lista = receta.detalles || receta.ingredientes;
    if (!lista) return;

    const factor = kilos / (receta.rendimientoBase || receta.cantidad || 10);
    lista.forEach((ing) => {
      const id = ing.idMateriaPrima || ing.materiaPrimaId || ing.nombre;
      if (!mapaInsumos[id]) {
        mapaInsumos[id] = {
          materiaPrimaId: ing.materiaPrimaId || (ing.idMateriaPrima ? `MP-${String(ing.idMateriaPrima).padStart(3, '0')}` : undefined),
          idMateriaPrima: ing.idMateriaPrima,
          nombre: ing.nombre || ing.materiaPrimaNombre,
          unidad: ing.unidad,
          cantidadRequerida: 0,
        };
      }
      mapaInsumos[id].cantidadRequerida += (ing.cantidad || ing.cantidadRequerida || 0) * factor;
    });
  });

  const insumos = Object.values(mapaInsumos).map((req) => {
    const cantReq = Number(req.cantidadRequerida.toFixed(2));
    const mp = inventario.find(
      (item) => item.id === req.materiaPrimaId || item.idMateriaPrima === req.idMateriaPrima || item.nombre?.toLowerCase() === req.nombre?.toLowerCase()
    );
    const stockActual = mp ? mp.stockActual : 0;
    const falta = Math.max(0, Number((cantReq - stockActual).toFixed(2)));
    const esFaltante = falta > 0;

    return {
      ...req,
      idMateriaPrima: req.idMateriaPrima || (mp ? mp.idMateriaPrima : null),
      nombre: req.nombre || (mp ? mp.nombre : 'Insumo'),
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
