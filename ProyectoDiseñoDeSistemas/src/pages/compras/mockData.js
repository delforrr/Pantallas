import { pendingItems } from './logic';
/**
 * mockData.js - Módulo de Compras (PastaFab ERP)
 * Autocontenido y fiel a los diagramas del dominio del sistema.
 * 
 * Clases del dominio reflejadas:
 * - Proveedor (IdProveedor, RazónSocial, Cuit, Domicilio, Teléfono, Email, Categoría)
 * - PresupuestoProveedor (IDPresupuesto, Proveedor, FechaEmisión, ValidezHasta, Total, DetallePresupuestoProveedor)
 * - OrdenDeCompraDeInsumos (IDOrdenCompra, Proveedor, FechaEmision, FechaEntregaEstimada, Total, Detalles)
 * - FacturaCompraProveedor (IDComprobanteDeCompra, Proveedor, FechaEmision, Total, Estado)
 * - RemitoProveedor (IDRemitoProveedor, Proveedor, FechaEmision, FechaEntregaReal, Estado)
 * - ComprobanteDePagoProveedor (IDComprobanteDePagoProveedor, Factura, Proveedor, Total, MedioPago)
 */

export const MOCK_DOC_PRESUPUESTO = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
  <rect width="500" height="700" fill="#ffffff" rx="8" />
  <rect x="0" y="0" width="500" height="80" fill="#1b4332" />
  <text x="30" y="48" fill="#ffffff" font-family="Arial, sans-serif" font-size="20" font-weight="bold">PRESUPUESTO COMERCIAL PROVEEDOR</text>
  <text x="30" y="110" fill="#333333" font-family="Arial, sans-serif" font-size="14" font-weight="bold">MOLINO HARINERO DEL CENTRO S.A.</text>
  <text x="30" y="130" fill="#666666" font-family="Arial, sans-serif" font-size="12">CUIT: 30-58492014-9 | Av. San Martín 1450, Trenque Lauquen</text>
  <line x1="30" y1="145" x2="470" y2="145" stroke="#e0e0e0" stroke-width="1.5" />
  <text x="30" y="170" fill="#666666" font-family="Arial, sans-serif" font-size="12">Cliente: Pastas Frescas PastaFab S.R.L.</text>
  <text x="350" y="170" fill="#666666" font-family="Arial, sans-serif" font-size="12">Fecha: 02/03/2026</text>
  <rect x="30" y="190" width="440" height="30" fill="#f4f6f8" rx="4" />
  <text x="40" y="210" fill="#333333" font-family="Arial, sans-serif" font-size="12" font-weight="bold">COTIZACIÓN DE MATERIAS PRIMAS</text>
  <text x="40" y="250" fill="#444444" font-family="Arial, sans-serif" font-size="12">80 x Harina 0000 Especial Pastas (50kg)</text>
  <text x="380" y="250" fill="#444444" font-family="Arial, sans-serif" font-size="12">$2.560.000</text>
  <text x="40" y="280" fill="#444444" font-family="Arial, sans-serif" font-size="12">40 x Semolín de Trigo Candeal (25kg)</text>
  <text x="380" y="280" fill="#444444" font-family="Arial, sans-serif" font-size="12">$1.280.000</text>
  <line x1="30" y1="310" x2="470" y2="310" stroke="#e0e0e0" stroke-width="1" />
  <text x="40" y="340" fill="#1b4332" font-family="Arial, sans-serif" font-size="16" font-weight="bold">TOTAL COTIZADO: $3.840.000</text>
  <rect x="290" y="420" width="165" height="70" fill="none" stroke="#2d6a4f" stroke-width="2" rx="4" transform="rotate(-6 372 455)" />
  <text x="310" y="450" fill="#2d6a4f" font-family="Arial, sans-serif" font-size="13" font-weight="bold" transform="rotate(-6 372 455)">COTIZACIÓN OFICIAL</text>
  <text x="320" y="470" fill="#2d6a4f" font-family="Arial, sans-serif" font-size="10" transform="rotate(-6 372 455)">FIRMA Y SELLO PROVEEDOR</text>
</svg>`);

export const MOCK_DOC_FACTURA = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
  <rect width="500" height="700" fill="#ffffff" rx="8" />
  <rect x="0" y="0" width="500" height="90" fill="#003566" />
  <rect x="230" y="15" width="40" height="40" fill="#ffffff" rx="4" />
  <text x="242" y="43" fill="#003566" font-family="Arial, sans-serif" font-size="26" font-weight="bold">A</text>
  <text x="30" y="45" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="bold">FACTURA ELECTRÓNICA</text>
  <text x="30" y="70" fill="#90e0ef" font-family="Arial, sans-serif" font-size="12">COMPROBANTE AUTORIZADO POR AFIP</text>
  <text x="30" y="120" fill="#111111" font-family="Arial, sans-serif" font-size="13" font-weight="bold">LEVADURAS CALSA ARGENTINA S.A.</text>
  <text x="30" y="140" fill="#666666" font-family="Arial, sans-serif" font-size="11">Ruta Nacional 5 Km 445 - CUIT: 30-61245899-3</text>
  <line x1="30" y1="160" x2="470" y2="160" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="30" y="185" fill="#333333" font-family="Arial, sans-serif" font-size="12">Factura Nº: FC-A-0002-00001890</text>
  <text x="320" y="185" fill="#333333" font-family="Arial, sans-serif" font-size="12">Fecha: 11/03/2026</text>
  <text x="30" y="210" fill="#666666" font-family="Arial, sans-serif" font-size="12">Cliente: Pastas Frescas PastaFab S.R.L. | CUIT: 30-71994821-2</text>
  <rect x="30" y="235" width="440" height="120" fill="#f8fafc" rx="6" stroke="#e2e8f0" />
  <text x="45" y="265" fill="#333333" font-family="Arial, sans-serif" font-size="12">Subtotal Neto Gravado:</text>
  <text x="370" y="265" fill="#333333" font-family="Arial, sans-serif" font-size="12" font-weight="bold">$809.917</text>
  <text x="45" y="295" fill="#333333" font-family="Arial, sans-serif" font-size="12">IVA Liquidado (21%):</text>
  <text x="370" y="295" fill="#333333" font-family="Arial, sans-serif" font-size="12" font-weight="bold">$170.083</text>
  <line x1="45" y1="315" x2="455" y2="315" stroke="#cbd5e1" stroke-width="1" />
  <text x="45" y="340" fill="#003566" font-family="Arial, sans-serif" font-size="15" font-weight="bold">TOTAL LIQUIDADO:</text>
  <text x="360" y="340" fill="#003566" font-family="Arial, sans-serif" font-size="16" font-weight="bold">$980.000</text>
  <rect x="40" y="420" width="220" height="50" fill="#e2e8f0" rx="4" />
  <text x="50" y="445" fill="#475569" font-family="Arial, sans-serif" font-size="10">CAE: 74218902834190</text>
  <text x="50" y="460" fill="#475569" font-family="Arial, sans-serif" font-size="10">Vencimiento CAE: 21/03/2026</text>
</svg>`);

export const MOCK_DOC_REMITO = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
  <rect width="500" height="700" fill="#ffffff" rx="8" />
  <rect x="0" y="0" width="500" height="85" fill="#2b2d42" />
  <rect x="230" y="15" width="40" height="40" fill="#ffffff" rx="4" />
  <text x="242" y="43" fill="#2b2d42" font-family="Arial, sans-serif" font-size="26" font-weight="bold">R</text>
  <text x="30" y="45" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="bold">REMITO DE ENTREGA</text>
  <text x="30" y="68" fill="#8d99ae" font-family="Arial, sans-serif" font-size="11">DOCUMENTO NO VÁLIDO COMO FACTURA</text>
  <text x="30" y="115" fill="#111111" font-family="Arial, sans-serif" font-size="13" font-weight="bold">MOLINO HARINERO DEL CENTRO S.A.</text>
  <text x="30" y="135" fill="#666666" font-family="Arial, sans-serif" font-size="11">Transporte propio - Chofer: C. Morales (Patente AF 291 LK)</text>
  <line x1="30" y1="155" x2="470" y2="155" stroke="#e0e0e0" stroke-width="1.5" />
  <text x="30" y="180" fill="#333333" font-family="Arial, sans-serif" font-size="12">Remito Nº: REM-0001-00028914</text>
  <text x="320" y="180" fill="#333333" font-family="Arial, sans-serif" font-size="12">Fecha: 10/03/2026</text>
  <rect x="30" y="210" width="440" height="110" fill="#f8fafc" rx="6" />
  <text x="45" y="240" fill="#333333" font-family="Arial, sans-serif" font-size="12" font-weight="bold">MERCADERÍA RECIBIDA EN PLANTA:</text>
  <text x="45" y="270" fill="#444444" font-family="Arial, sans-serif" font-size="12">• 80 Bolsas Harina 0000 Especial (50kg)</text>
  <text x="45" y="295" fill="#444444" font-family="Arial, sans-serif" font-size="12">• 40 Bolsas Semolín de Trigo (25kg)</text>
  <rect x="290" y="380" width="165" height="75" fill="none" stroke="#009246" stroke-width="2.5" rx="6" transform="rotate(-5 372 417)" />
  <text x="305" y="415" fill="#009246" font-family="Arial, sans-serif" font-size="14" font-weight="bold" transform="rotate(-5 372 417)">RECIBIDO CONFORME</text>
  <text x="320" y="435" fill="#009246" font-family="Arial, sans-serif" font-size="11" transform="rotate(-5 372 417)">CONTROL DE BALANZA OK</text>
</svg>`);

export const MOCK_DOC_PAGO = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
  <rect width="500" height="700" fill="#ffffff" rx="8" />
  <rect x="0" y="0" width="500" height="85" fill="#007f5f" />
  <text x="30" y="42" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="bold">BANCO PROVINCIA</text>
  <text x="30" y="65" fill="#d8f3dc" font-family="Arial, sans-serif" font-size="12">COMPROBANTE DE TRANSFERENCIA BANCARIA</text>
  <text x="30" y="120" fill="#111111" font-family="Arial, sans-serif" font-size="13" font-weight="bold">PASTAFAB S.R.L. - CUENTA CORRIENTE</text>
  <text x="30" y="140" fill="#666666" font-family="Arial, sans-serif" font-size="11">CBU Origen: 0140321101200045981290</text>
  <line x1="30" y1="160" x2="470" y2="160" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="30" y="190" fill="#333333" font-family="Arial, sans-serif" font-size="12">Beneficiario: Molino Harinero del Centro S.A.</text>
  <text x="30" y="215" fill="#333333" font-family="Arial, sans-serif" font-size="12">CUIT Beneficiario: 30-58492014-9</text>
  <text x="30" y="240" fill="#333333" font-family="Arial, sans-serif" font-size="12">CBU Destino: 0140321101900012876543</text>
  <rect x="30" y="270" width="440" height="100" fill="#f0fdf4" rx="6" stroke="#bbf7d0" />
  <text x="45" y="305" fill="#166534" font-family="Arial, sans-serif" font-size="13" font-weight="bold">IMPORTE DEBITADO:</text>
  <text x="45" y="345" fill="#15803d" font-family="Arial, sans-serif" font-size="28" font-weight="bold">$3.840.000,00</text>
  <text x="30" y="410" fill="#666666" font-family="Arial, sans-serif" font-size="11">Nro. de Control Transaccional: TRX-BP-20260310-9941</text>
  <text x="30" y="430" fill="#666666" font-family="Arial, sans-serif" font-size="11">Fecha y Hora: 10/03/2026 11:24:18</text>
  <rect x="300" y="480" width="150" height="50" fill="#dcfce7" rx="4" />
  <text x="315" y="510" fill="#15803d" font-family="Arial, sans-serif" font-size="12" font-weight="bold">OPERACIÓN EXITOSA</text>
</svg>`);

export const INITIAL_PROVEEDORES = [
  {
    id: 1,
    cuit: '30-58492014-9',
    razonSocial: 'Molino Harinero del Centro S.A.',
    contacto: 'Ing. Roberto Molinari',
    telefono: '(02392) 41-8920',
    email: 'ventas@molinocentro.com.ar',
    calle: 'Av. San Martín',
    altura: '1450',
    localidad: 'Trenque Lauquen',
    provincia: 'Buenos Aires',
    categoria: 'Materia Prima Principal (Semestral)',
    estado: 'Activo',
  },
  {
    id: 2,
    cuit: '30-61245899-3',
    razonSocial: 'Levaduras Calsa Argentina S.A.',
    contacto: 'Mariana Gomez',
    telefono: '(011) 4720-3300',
    email: 'pedidos@calsa.com.ar',
    calle: 'Ruta Nacional 5 Km 445',
    altura: 'S/N',
    localidad: 'Trenque Lauquen',
    provincia: 'Buenos Aires',
    categoria: 'Materia Prima Principal (Semestral)',
    estado: 'Activo',
  },
  {
    id: 3,
    cuit: '20-28491023-4',
    razonSocial: 'Distribuidora Avícola San Antonio',
    contacto: 'Antonio Alvarez',
    telefono: '(02392) 52-1144',
    email: 'avicolasanantonio@gmail.com',
    calle: 'Villegas',
    altura: '840',
    localidad: 'Trenque Lauquen',
    provincia: 'Buenos Aires',
    categoria: 'Insumos Locales / Frescos',
    estado: 'Activo',
  },
  {
    id: 4,
    cuit: '30-70192844-1',
    razonSocial: 'Lácteos & Quesos La Serenísima Regional',
    contacto: 'Claudio Rossi',
    telefono: '(02392) 43-2200',
    email: 'distribucion.oeste@laserenisima.com.ar',
    calle: 'García Salinas',
    altura: '1210',
    localidad: 'Trenque Lauquen',
    provincia: 'Buenos Aires',
    categoria: 'Insumos Locales / Frescos',
    estado: 'Activo',
  },
  {
    id: 5,
    cuit: '30-71445982-6',
    razonSocial: 'Envases & Descartables Pampeanos',
    contacto: 'Valeria Benítez',
    telefono: '(02302) 42-6789',
    email: 'ventas@envasespampeanos.com.ar',
    calle: 'Parque Industrial Lote 12',
    altura: 'S/N',
    localidad: 'General Pico',
    provincia: 'La Pampa',
    categoria: 'Descartables & Packaging',
    estado: 'Activo',
  },
  {
    id: 6,
    cuit: '23-31456987-9',
    razonSocial: 'Frigorífico & Carnes El Fortín S.R.L.',
    contacto: 'Damián Cestari',
    telefono: '(02392) 42-3390',
    email: 'comercial@carneselfortin.com.ar',
    calle: 'Roca',
    altura: '480',
    localidad: 'Trenque Lauquen',
    provincia: 'Buenos Aires',
    categoria: 'Insumos Locales / Frescos',
    estado: 'Activo',
  },
  {
    id: 7,
    cuit: '27-24987123-5',
    razonSocial: 'Quinta & Hortalizas Don Pedro',
    contacto: 'Pedro Mendizábal',
    telefono: '(02392) 61-9012',
    email: 'pedro.quinta@gmail.com',
    calle: 'Acceso Rodríguez Mera',
    altura: '230',
    localidad: 'Trenque Lauquen',
    provincia: 'Buenos Aires',
    categoria: 'Insumos Locales / Frescos',
    estado: 'Inactivo',
  },
];

export const INITIAL_PRESUPUESTOS = [
  {
    id: 'PP-2026-001',
    proveedorId: 1,
    proveedorNombre: 'Molino Harinero del Centro S.A.',
    cuit: '30-58492014-9',
    fechaEmision: '2026-03-02',
    validezHasta: '2026-03-31',
    tipoCompra: 'Semestral (Marzo - Temporada Baja)',
    estado: 'Aprobado',
    items: [
      { id: 1, materiaPrima: 'Harina 0000 Especial Pastas (bolsa 50kg)', unidad: 'Bolsas', cantidad: 80, precioUnitario: 32000, subtotal: 2560000 },
      { id: 2, materiaPrima: 'Semolín de Trigo Candeal (bolsa 25kg)', unidad: 'Bolsas', cantidad: 40, precioUnitario: 32000, subtotal: 1280000 },
    ],
    total: 3840000,
    documentoUrl: MOCK_DOC_PRESUPUESTO,
  },
  {
    id: 'PP-2026-002',
    proveedorId: 2,
    proveedorNombre: 'Levaduras Calsa Argentina S.A.',
    cuit: '30-61245899-3',
    fechaEmision: '2026-03-04',
    validezHasta: '2026-12-31',
    tipoCompra: 'Semestral (Marzo - Temporada Baja)',
    estado: 'Aprobado',
    items: [
      { id: 1, materiaPrima: 'Levadura fresca prensada (caja 5kg)', unidad: 'Cajas', cantidad: 40, precioUnitario: 22000, subtotal: 880000 },
      { id: 2, materiaPrima: 'Polvo Leudante Químico (balde 10kg)', unidad: 'Baldes', cantidad: 5, precioUnitario: 20000, subtotal: 100000 },
    ],
    total: 980000,
    documentoUrl: MOCK_DOC_PRESUPUESTO,
  },
  {
    id: 'PP-2026-003',
    proveedorId: 1,
    proveedorNombre: 'Molino Harinero San Blas (Alternativo)',
    cuit: '30-55123984-7',
    fechaEmision: '2026-03-01',
    validezHasta: '2026-12-31',
    tipoCompra: 'Semestral (Marzo - Temporada Baja)',
    estado: 'Rechazado',
    items: [
      { id: 1, materiaPrima: 'Harina 0000 Industrial (bolsa 50kg)', unidad: 'Bolsas', cantidad: 80, precioUnitario: 35500, subtotal: 2840000 },
      { id: 2, materiaPrima: 'Semolín común (bolsa 25kg)', unidad: 'Bolsas', cantidad: 40, precioUnitario: 35250, subtotal: 1410000 },
    ],
    total: 4250000,
    documentoUrl: MOCK_DOC_PRESUPUESTO,
  },
  {
    id: 'PP-2026-004',
    proveedorId: 3,
    proveedorNombre: 'Distribuidora Avícola San Antonio',
    cuit: '20-28491023-4',
    fechaEmision: '2026-03-10',
    validezHasta: '2026-03-18',
    tipoCompra: 'Insumos Locales / Reposición',
    estado: 'Pendiente',
    items: [
      { id: 1, materiaPrima: 'Huevos seleccionados Grado A (maple x30)', unidad: 'Maples', cantidad: 80, precioUnitario: 4500, subtotal: 360000 },
    ],
    total: 360000,
    documentoUrl: MOCK_DOC_PRESUPUESTO,
  },
  {
    id: 'PP-2026-005',
    proveedorId: 5,
    proveedorNombre: 'Envases & Descartables Pampeanos',
    cuit: '30-71445982-6',
    fechaEmision: '2026-03-08',
    validezHasta: '2026-12-31',
    tipoCompra: 'Semestral (Marzo - Temporada Baja)',
    estado: 'Pendiente',
    items: [
      { id: 1, materiaPrima: 'Cajas para ravioles 1kg con separador', unidad: 'Unidades', cantidad: 2500, precioUnitario: 320, subtotal: 800000 },
      { id: 2, materiaPrima: 'Bandejas plásticas fideos termoformadas', unidad: 'Unidades', cantidad: 3000, precioUnitario: 140, subtotal: 420000 },
      { id: 3, materiaPrima: 'Potes térmicos salsas 500cc c/tapa', unidad: 'Unidades', cantidad: 1000, precioUnitario: 200, subtotal: 200000 },
    ],
    total: 1420000,
    documentoUrl: MOCK_DOC_PRESUPUESTO,
  },
  {
    id: 'PP-2026-006',
    proveedorId: 4,
    proveedorNombre: 'Lácteos & Quesos La Serenísima Regional',
    cuit: '30-70192844-1',
    fechaEmision: '2026-02-15',
    validezHasta: '2026-02-28',
    tipoCompra: 'Insumos Locales / Reposición',
    estado: 'Vencido',
    items: [
      { id: 1, materiaPrima: 'Ricotta fresca entera pasteurizada', unidad: 'Kilos', cantidad: 60, precioUnitario: 6800, subtotal: 408000 },
      { id: 2, materiaPrima: 'Queso Muzzarella en barra', unidad: 'Kilos', cantidad: 50, precioUnitario: 9640, subtotal: 482000 },
    ],
    total: 890000,
    documentoUrl: MOCK_DOC_PRESUPUESTO,
  },
];

export const INITIAL_ORDENES_COMPRA = [
  {
    id: 'OC-2026-0101',
    presupuestoId: 'PP-2026-001',
    proveedorId: 1,
    proveedorNombre: 'Molino Harinero del Centro S.A.',
    fechaEmision: '2026-03-05',
    fechaEntregaEstimada: '2026-03-12',
    estado: 'Cumplida',
    total: 3840000,
    observaciones: 'Compra mayorista semestral. Mercadería descargada y conformada por depósito.',
    items: [
      { id: 1, materiaPrima: 'Harina 0000 Especial Pastas (bolsa 50kg)', unidad: 'Bolsas', cantidad: 80, precioUnitario: 32000, subtotal: 2560000 },
      { id: 2, materiaPrima: 'Semolín de Trigo Candeal (bolsa 25kg)', unidad: 'Bolsas', cantidad: 40, precioUnitario: 32000, subtotal: 1280000 },
    ],
  },
  {
    id: 'OC-2026-0102',
    presupuestoId: 'PP-2026-002',
    proveedorId: 2,
    proveedorNombre: 'Levaduras Calsa Argentina S.A.',
    fechaEmision: '2026-03-06',
    fechaEntregaEstimada: '2026-03-15',
    estado: 'Enviada',
    total: 980000,
    observaciones: 'En tránsito hacia planta en camión refrigerado.',
    items: [
      { id: 1, materiaPrima: 'Levadura fresca prensada (caja 5kg)', unidad: 'Cajas', cantidad: 40, precioUnitario: 22000, subtotal: 880000 },
      { id: 2, materiaPrima: 'Polvo Leudante Químico (balde 10kg)', unidad: 'Baldes', cantidad: 5, precioUnitario: 20000, subtotal: 100000 },
    ],
  },
  {
    id: 'OC-2026-0103',
    presupuestoId: null,
    proveedorId: 4,
    proveedorNombre: 'Lácteos & Quesos La Serenísima Regional',
    fechaEmision: '2026-03-11',
    fechaEntregaEstimada: '2026-03-13',
    estado: 'Recibida Parcial',
    total: 540000,
    items: [
      { id: 1, materiaPrima: 'Ricotta fresca entera pasteurizada', unidad: 'Kilos', cantidad: 50, precioUnitario: 6800, subtotal: 340000 },
      { id: 2, materiaPrima: 'Queso Parmesano para rallar', unidad: 'Kilos', cantidad: 20, precioUnitario: 10000, subtotal: 200000 },
    ],
  },
  {
    id: 'OC-2026-0104',
    presupuestoId: 'PP-2026-005',
    proveedorId: 5,
    proveedorNombre: 'Envases & Descartables Pampeanos',
    fechaEmision: '2026-03-12',
    fechaEntregaEstimada: '2026-03-22',
    estado: 'Pendiente',
    total: 1420000,
    items: [
      { id: 1, materiaPrima: 'Cajas para ravioles 1kg con separador', unidad: 'Unidades', cantidad: 2500, precioUnitario: 320, subtotal: 800000 },
      { id: 2, materiaPrima: 'Bandejas plásticas fideos termoformadas', unidad: 'Unidades', cantidad: 3000, precioUnitario: 140, subtotal: 420000 },
      { id: 3, materiaPrima: 'Potes térmicos salsas 500cc c/tapa', unidad: 'Unidades', cantidad: 1000, precioUnitario: 200, subtotal: 200000 },
    ],
  },
  {
    id: 'OC-2026-0105',
    presupuestoId: null,
    proveedorId: 3,
    proveedorNombre: 'Distribuidora Avícola San Antonio',
    fechaEmision: '2026-03-01',
    fechaEntregaEstimada: '2026-03-03',
    estado: 'Cancelada',
    total: 320000,
    items: [
      { id: 1, materiaPrima: 'Huevos seleccionados Grado A (maple x30)', unidad: 'Maples', cantidad: 70, precioUnitario: 4571, subtotal: 320000 },
    ],
  },
];

export const INITIAL_FACTURAS = [
  {
    id: 'FC-A-0001-00004521',
    ordenCompraId: 'OC-2026-0101',
    proveedorId: 1,
    proveedorNombre: 'Molino Harinero del Centro S.A.',
    cuit: '30-58492014-9',
    fechaEmision: '2026-03-10',
    fechaVencimiento: '2026-04-10',
    condicionPago: '30 días Fecha Factura',
    netoGravado: 3173554,
    iva21: 666446,
    total: 3840000,
    estado: 'Pagada',
    comprobantePagoId: 'OP-2026-0045',
    documentoUrl: MOCK_DOC_FACTURA,
  },
  {
    id: 'FC-A-0002-00001890',
    ordenCompraId: 'OC-2026-0102',
    proveedorId: 2,
    proveedorNombre: 'Levaduras Calsa Argentina S.A.',
    cuit: '30-61245899-3',
    fechaEmision: '2026-03-11',
    fechaVencimiento: '2026-03-25',
    condicionPago: 'Contado Contra Entrega',
    netoGravado: 809917,
    iva21: 170083,
    total: 980000,
    estado: 'Pendiente de Pago',
    comprobantePagoId: null,
    documentoUrl: MOCK_DOC_FACTURA,
  },
  {
    id: 'FC-B-0004-00000312',
    ordenCompraId: 'OC-2026-0103',
    proveedorId: 4,
    proveedorNombre: 'Lácteos & Quesos La Serenísima Regional',
    cuit: '30-70192844-1',
    fechaEmision: '2026-03-12',
    fechaVencimiento: '2026-03-30',
    condicionPago: 'Cuenta Corriente',
    netoGravado: 446281,
    iva21: 93719,
    total: 540000,
    estado: 'Pendiente de Pago',
    comprobantePagoId: null,
    documentoUrl: MOCK_DOC_FACTURA,
  },
  {
    id: 'FC-A-0003-00007811',
    ordenCompraId: 'OC-2026-0098',
    proveedorId: 5,
    proveedorNombre: 'Envases & Descartables Pampeanos',
    cuit: '30-71445982-6',
    fechaEmision: '2026-02-20',
    fechaVencimiento: '2026-03-05',
    condicionPago: 'Transferencia Inmediata',
    netoGravado: 950413,
    iva21: 199587,
    total: 1150000,
    estado: 'Pagada',
    comprobantePagoId: 'OP-2026-0044',
    documentoUrl: MOCK_DOC_FACTURA,
  },
  {
    id: 'FC-C-0001-00000045',
    ordenCompraId: 'OC-2026-0095',
    proveedorId: 7,
    proveedorNombre: 'Quinta & Hortalizas Don Pedro',
    cuit: '27-24987123-5',
    fechaEmision: '2026-02-18',
    fechaVencimiento: '2026-02-28',
    condicionPago: 'Efectivo',
    netoGravado: 185000,
    iva21: 0,
    total: 185000,
    estado: 'Anulada',
    comprobantePagoId: null,
    documentoUrl: MOCK_DOC_FACTURA,
  },
];

export const INITIAL_REMITOS = [
  {
    id: 'REM-0001-00028914',
    ordenCompraId: 'OC-2026-0101',
    proveedorId: 1,
    proveedorNombre: 'Molino Harinero del Centro S.A.',
    fechaEmision: '2026-03-10',
    fechaEntregaReal: '2026-03-10',
    observaciones: '80 bolsas de harina 0000 y 40 bolsas de semolín ingresadas al silo y depósito.',
    documentoUrl: MOCK_DOC_REMITO,
    items: [
      { materiaPrima: 'Harina 0000 Especial Pastas (bolsa 50kg)', cantidadRecibida: 80, unidad: 'Bolsas', conforme: true },
      { materiaPrima: 'Semolín de Trigo Candeal (bolsa 25kg)', cantidadRecibida: 40, unidad: 'Bolsas', conforme: true },
    ],
  },
  {
    id: 'REM-0002-00011409',
    ordenCompraId: 'OC-2026-0102',
    proveedorId: 2,
    proveedorNombre: 'Levaduras Calsa Argentina S.A.',
    fechaEmision: '2026-03-14',
    fechaEntregaReal: '2026-03-14',
    observaciones: 'Temperatura de transporte 4°C, conforme a normas bromatológicas.',
    documentoUrl: MOCK_DOC_REMITO,
    items: [
      { materiaPrima: 'Levadura fresca prensada (caja 5kg)', cantidadRecibida: 40, unidad: 'Cajas', conforme: true },
      { materiaPrima: 'Polvo Leudante Químico (balde 10kg)', cantidadRecibida: 5, unidad: 'Baldes', conforme: true },
    ],
  },
  {
    id: 'REM-0004-00005510',
    ordenCompraId: 'OC-2026-0103',
    proveedorId: 4,
    proveedorNombre: 'Lácteos & Quesos La Serenísima Regional',
    fechaEmision: '2026-03-12',
    fechaEntregaReal: '2026-03-12',
    observaciones: 'Recibidos 45kg de Ricotta (faltaron 5kg por rotura de envase en flete) y 20kg de Parmesano.',
    documentoUrl: MOCK_DOC_REMITO,
    items: [
      { materiaPrima: 'Ricotta fresca entera pasteurizada', cantidadRecibida: 45, unidad: 'Kilos', conforme: false },
      { materiaPrima: 'Queso Parmesano para rallar', cantidadRecibida: 20, unidad: 'Kilos', conforme: true },
    ],
  },
  {
    id: 'REM-0003-00009122',
    ordenCompraId: 'OC-2026-0098',
    proveedorId: 5,
    proveedorNombre: 'Envases & Descartables Pampeanos',
    fechaEmision: '2026-02-22',
    fechaEntregaReal: '2026-02-23',
    observaciones: 'Bandejas y cajas recibidas sin daños de embalaje.',
    documentoUrl: MOCK_DOC_REMITO,
    items: [
      { materiaPrima: 'Cajas para ravioles 1kg con separador', cantidadRecibida: 2000, unidad: 'Unidades', conforme: true },
    ],
  },
  {
    id: 'REM-0001-00000781',
    ordenCompraId: 'OC-2026-0095',
    proveedorId: 7,
    proveedorNombre: 'Quinta & Hortalizas Don Pedro',
    fechaEmision: '2026-02-18',
    fechaEntregaReal: '2026-02-18',
    observaciones: 'La espinaca presentaba signos de marchitamiento avanzado por pérdida de cadena de frío.',
    documentoUrl: MOCK_DOC_REMITO,
    items: [
      { materiaPrima: 'Espinaca fresca lavada', cantidadRecibida: 0, unidad: 'Kilos', conforme: false },
    ],
  },
];

export const INITIAL_COMPROBANTES_PAGO = [
  {
    id: 'OP-2026-0045',
    facturaId: 'FC-A-0001-00004521',
    proveedorId: 1,
    proveedorNombre: 'Molino Harinero del Centro S.A.',
    fechaEmision: '2026-03-10',
    medioPago: 'Transferencia Bancaria',
    nroTransaccion: 'TRX-BP-20260310-9941',
    banco: 'Banco de la Provincia de Buenos Aires (Cuenta Corriente PastaFab)',
    total: 3840000,
    estado: 'Conciliado',
    observaciones: 'Pago total de compra mayorista de harina 0000 y semolín.',
    documentoUrl: MOCK_DOC_PAGO,
  },
  {
    id: 'OP-2026-0044',
    facturaId: 'FC-A-0003-00007811',
    proveedorId: 5,
    proveedorNombre: 'Envases & Descartables Pampeanos',
    fechaEmision: '2026-02-25',
    medioPago: 'Transferencia Bancaria',
    nroTransaccion: 'TRX-BP-20260225-3312',
    banco: 'Banco de la Pampa',
    total: 1150000,
    estado: 'Conciliado',
    observaciones: 'Liquidación de factura por insumos de packaging descartable.',
    documentoUrl: MOCK_DOC_PAGO,
  },
  {
    id: 'OP-2026-0043',
    facturaId: 'FC-B-0002-00000840',
    proveedorId: 3,
    proveedorNombre: 'Distribuidora Avícola San Antonio',
    fechaEmision: '2026-02-28',
    medioPago: 'Débito Automático',
    nroTransaccion: 'DEB-AUT-20260228',
    banco: 'Banco de la Provincia de Buenos Aires',
    total: 280000,
    estado: 'Conciliado',
    observaciones: 'Débito semanal programado de huevos frescos.',
    documentoUrl: MOCK_DOC_PAGO,
  },
  {
    id: 'OP-2026-0042',
    facturaId: 'FC-B-0003-00001920',
    proveedorId: 4,
    proveedorNombre: 'Lácteos & Quesos La Serenísima Regional',
    fechaEmision: '2026-02-20',
    medioPago: 'Efectivo',
    nroTransaccion: 'REC-EF-8910',
    banco: 'Caja Principal Planta',
    total: 410000,
    estado: 'Conciliado',
    observaciones: 'Pago en efectivo contra recibo oficial de cobranza en mostrador de fábrica.',
    documentoUrl: MOCK_DOC_PAGO,
  },
];

// Cada pantalla obtiene su propia simulación; no se comparte estado entre módulos ni pantallas.
export function initialReceptionState() {
  const stock = {};
  INITIAL_REMITOS.forEach(r => r.items.forEach(i => {
    const key = `${i.materiaPrima}|${i.unidad}`;
    stock[key] = (stock[key] || 0) + i.cantidadRecibida;
  }));
  const ordenes = INITIAL_ORDENES_COMPRA.map(o => INITIAL_REMITOS.some(r => r.ordenCompraId === o.id) ? { ...o, estado: pendingItems(o, INITIAL_REMITOS).every(i => i.pendiente === 0) ? 'Cumplida' : 'Recibida Parcial' } : o);
  return { ordenes, remitos: INITIAL_REMITOS, stock };
}
