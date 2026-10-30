# Compras: contratos y simulación

- Estado local con `useState` por pantalla. Al salir se reinicia: no existen providers, contexto global, persistencia ni sincronización entre pantallas.
- La orden creada desde Presupuestos se consulta en su confirmación local. Las recepciones de Órdenes y de Facturas/Remitos son simulaciones independientes.
- Presupuesto aceptado y vigente como origen normal; compra directa solo como reposición puntual de insumos menores a proveedor local, identificada por el encargado e indicando motivo. No hay límite monetario ni clasificación geográfica automática.
- `CondicionPago` debe agregarse a OrdenDeCompraProveedor en el diagrama. Se registra como texto en la orden, no en el presupuesto; no genera vencimientos. Los campos existentes de factura/pago se conservan.
- `PrecioUnitario` debe agregarse a DetallePresupuestoProveedor y DetalleCompraProveedor. `Importe` es cantidad por precio unitario; el total suma esos importes. Se conservan centavos.
- El desglose de recepción se consulta en el remito, junto con el acumulado recibido y saldo de su orden asociada. El detalle de la orden conserva las referencias a remitos y facturas.
- Cada remito registra las cantidades aceptadas por materia prima/unidad. Se rechazan números de remito repetidos, cantidades no finitas, negativas, superiores al saldo o recepciones vacías. El faltante conserva la orden parcial.
- El stock recibido se consulta únicamente en Facturas/Remitos, con acceso a los remitos asociados a cada materia prima y unidad. No se muestra en Órdenes de Compra.
- «Enviar al proveedor» se conserva como botón de icono con tooltip: cambia la orden Pendiente a Enviada y habilita su recepción.
- El stock muestra únicamente lo recibido en esta simulación y no representa el saldo real de Producción. La factura no vuelve a sumar stock.
- Los mocks incluyen presupuestos vigentes hasta diciembre de 2026 y vencidos, órdenes parciales/completas y documentos históricos.
- Domicilios de proveedores: provincia → localidad → calle, con selectores y altas mediante «+». El catálogo inicial se deriva de los proveedores existentes; las altas quedan en memoria dentro de la pantalla. Cambiar provincia limpia localidad/calle; cambiar localidad limpia calle. Se impiden nombres vacíos y duplicados dentro de su provincia/localidad.
- Tipos de campo: CUIT e identificadores como texto; teléfono `tel`; correo `email`; fechas `date`; cantidades y precios numéricos con precisión existente; altura y piso numéricos enteros opcionales; departamento como texto independiente. Los domicilios históricos «S/N» se conservan al guardar si no se ingresa una altura.

## Verificación

`node --test src/pages/compras/addressCatalog.test.mjs src/pages/compras/logic.test.mjs src/pages/mantenimiento/logic.test.mjs`

`npm run lint` y `npm run build` (sin agregar dependencias).

Los listados se comprobaron en el navegador integrado a 320, 375, 768, 1024 y 1440 px. Los formularios se revisan además a 320×740 y 740×375, comprobando ancho, campos y pie de acciones. El selector de fecha nativo se prueba por accesibilidad.
