# Implementation Plan: Rediseño UX/UI Avanzado, Contraste Claro, Anti-Slop y Micro-interacciones (PastaFab ERP)

## Overview
Elevación del nivel estético y de usabilidad de los módulos de **Compras** y **Mantenimiento** según las solicitudes del usuario:
1. **Imagen 1**: Mejora de contraste en tema claro, jerarquía visual y paleta cromática sin tocar el core congelado.
2. **Imagen 2**: Eliminación total de truncamiento en etiquetas (`Estado Op...` -> `Estado Operativo`) mediante migración exhaustiva a MUI v9 Grid2 (`size={{ ... }}`) y anchos mínimos adecuados en filtros y formularios.
3. **Imagen 3**: Rediseño profesional de la sección "3. Liquidación de Importes e IVA" en `FacturasRemitosScreen.jsx`, eliminando el aspecto "slop" (borde punteado desalineado) y reemplazándolo por un layout de 3 columnas de alto impacto.
4. **Feel & Responsividad**: Implementación de `backdrop-filter: blur(8px)` en todos los modales, transiciones suaves (micro-interacciones), elevación de tarjetas y contrastes nítidos.

## User Review Required
> [!IMPORTANT]
> **Core Congelado Respetado al 100%**: Las mejoras de contraste y estética se aplican mediante tokens y `sx={{ ... }}` en las pantallas y componentes del módulo, sin alterar `src/theme/` ni `package.json`, asegurando que `validate-pipeline.cjs` pase en verde.

## Proposed Changes

### Módulo Compras

#### [MODIFY] `src/pages/compras/FacturasRemitosScreen.jsx`
- **Solución Imagen 3 (Anti-Slop en Liquidación de Importes e IVA)**:
  - Reemplazar el contenedor desalineado con borde punteado por una grilla uniforme de 3 columnas (`size={{ xs: 12, sm: 4 }}`):
    1. Input `Neto Gravado ($)` con adorno `$` e input numérico prolijo.
    2. Tarjeta métrica de `IVA (21% Calculado)` con badge de porcentaje y fondo suave.
    3. Tarjeta de impacto `Monto Total a Facturar` con contraste premium, tipografía `h6`/`h5` destacada y sin borde punteado.
- **Solución Imagen 2 (Ancho de Inputs)**:
  - Migrar los 4 modales (`openNewFactura`, `openNewRemito`, `openPagoModal`, `openDetail`) de `<Grid item xs={...}>` a `<Grid size={{ ... }}>`.
  - Reemplazar `<form>` intermedio por `PaperProps={{ component: 'form', onSubmit: ... }}`.
  - Asegurar `pt: '24px !important'` en todos los `DialogContent`.
- **Efecto Blur & Feel**:
  - Incorporar backdrop blur en todos los Dialogs de la pantalla.

#### [MODIFY] `src/pages/compras/ProveedoresScreen.jsx`
- **Solución Imagen 2 (Etiquetas Truncadas en Formulario y Filtro)**:
  - En la barra de filtros, asegurar `minWidth: { xs: '100%', sm: 220, md: 240 }` en el select de Estado.
  - En el modal de alta/edición (`openForm`), migrar todos los campos de datos fiscales, contacto y localización a Grid `size={{ xs: 12, sm: 6 }}`.
  - Reemplazar `<form>` intermedio por `PaperProps={{ component: 'form', onSubmit: ... }}`.
  - Asegurar `pt: '24px !important'` en `DialogContent`.
  - Añadir backdrop blur y guía cromática (chips de estado y estrellas de calificación con contraste).

#### [MODIFY] `src/pages/compras/OrdenCompraScreen.jsx`
- **Solución Imagen 1 (Contraste en Tema Claro y Backdrop Blur)**:
  - Añadir backdrop blur (`backdropFilter: 'blur(8px)'`) en `openForm`, `openDetail` y `openDelete`.
  - Mejorar contrastes en tema claro para tarjetas de sección, cabeceras de tabla (`#f1f5f9` en modo claro) y botones de acción.
  - Micro-interacciones suaves en botones (`translateY(-1px)` en hover).

#### [MODIFY] `src/pages/compras/PresupuestoProveedorScreen.jsx`
- **Solución Imagen 1 & Blur**:
  - Añadir backdrop blur en los 3 modales.
  - Ajustar contraste de tema claro en tablas y tarjetas de insumos.

---

### Módulo Mantenimiento

#### [MODIFY] `src/pages/mantenimiento/MaquinariaScreen.jsx`
- **Filtros y Backdrop Blur**:
  - Asegurar `minWidth: 240` en `estadoFilter` y `lineaFilter` para que no se trunque "Estado Operativo".
  - Añadir backdrop blur en los 4 modales (`openForm`, `openDetail`, `openQuickOrder`, `openDelete`).
  - Optimizar contraste claro en tablas de características y plan de lubricación.

#### [MODIFY] `src/pages/mantenimiento/OrdenesMantScreen.jsx`
- **Backdrop Blur & Micro-interacciones**:
  - Añadir backdrop blur en los 3 modales (`openForm`, `openDetail`, `openDelete`).
  - Mejorar contraste en la tabla de repuestos en tema claro.

---

## Verification Plan

### Automated Tests
- `node .agents/scripts/validate-pipeline.cjs`
  - Verificación de Core Congelado: PASS
  - Verificación de Dependencias: PASS
  - `npm run lint`: 0 errores
  - `npm run build`: Compilación limpia sin fallos

### Manual Verification
- Inspeccionar visualmente en el navegador (`http://localhost:5173`):
  1. Abrir modal en `FacturasRemitosScreen`: Verificar sección "Liquidación de Importes e IVA" (3 columnas alineadas, sin borde punteado, tipografía destacada).
  2. Abrir modal en `ProveedoresScreen`: Verificar que "Estado Operativo" y todos los inputs muestren la etiqueta completa sin `...`.
  3. Comprobar el desenfoque de fondo (`backdrop blur`) al abrir cualquier modal en compras y mantenimiento.
  4. Alternar entre modo Claro y Oscuro para validar contrastes nítidos en tarjetas, tablas e inputs.

