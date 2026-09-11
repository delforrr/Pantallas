# Lineamientos para Agentes de IA y Estrategia de Equipo (PastaFab ERP)

Este documento define la **estrategia de trabajo colaborativo**, la **arquitectura modular estricta** y las **directrices técnicas** para que desarrolladores y agentes de IA (Antigravity, Cursor, Claude Code, ChatGPT, Copilot, etc.) construyan pantallas sin colisiones, disparidades visuales ni *merge conflicts*.

---

## 1. Estrategia de Equipo (La Mejor Manera de Trabajar)

Para garantizar consistencia visual y evitar conflictos de fusión entre los módulos de **Ventas**, **Compras**, **Producción**, **Mantenimiento** y **Cliente**:

### Regla 1: Congelar el Core en `main` o `develop`
Nadie programa su módulo hasta que una sola persona configure y suba a la rama principal:
1. **El tema de Material-UI (`src/theme/`)**: Con la paleta corporativa estándar (verde italiano `#009246` / `#2ECC71`, rojo `#CE2B37` / `#E74C3C`, fondos neutros y tipografía *Inter/Roboto*).
2. **El contenedor global (`src/components/layout/AppLayout.jsx`)**: Con el `AppSidebar`, `AppHeader` y el área de contenido principal / `<Outlet/>` de React Router.
3. **La estructura de rutas vacías**: (ej. `/ventas/pedidos`, `/produccion/ordenes`, etc.).

> **¡Atención Agentes de IA y Desarrolladores!**  
> **NO MODIFICAR** bajo ninguna circunstancia los archivos en `src/theme/` ni `src/components/layout/` salvo acuerdo explícito del equipo.

---

### Regla 2: Estructura Modular Estricta (*Package by Feature*)
Cada integrante debe trabajar **únicamente dentro de su carpeta aislada**:

```plaintext
src/
├── theme/                 # CONGELADO (Paleta institucional, overrides globales)
├── components/
│   ├── layout/            # CONGELADO (AppLayout, AppSidebar, AppHeader)
│   ├── shared/            # CONGELADO / Compartido (TableSkeleton, StatsRow, etc.)
│   ├── ventas/            # Componentes específicos de Ventas
│   ├── compras/           # Componentes específicos de Compras
│   ├── produccion/        # Componentes específicos de Producción
│   ├── mantenimiento/     # Componentes específicos de Mantenimiento
│   └── cliente/           # Componentes específicos del Portal Cliente
├── pages/                 # O src/modules/ (Vistas principales de cada sección)
│   ├── ventas/            # Rama: feature/ventas
│   ├── compras/           # Rama: feature/compras
│   ├── produccion/        # Rama: feature/produccion
│   ├── mantenimiento/     # Rama: feature/mantenimiento
│   └── cliente/           # Rama: feature/cliente
```

*Cada módulo puede estructurarse de forma autónoma conteniendo sus vistas (`screens/` o `pages/`), sus componentes internos y su `mockData.js`.*

---

### Regla 3: Datos Simulados Autocontenidos (`mockData.js`)
* Cada módulo debe tener su propio archivo `mockData.js` dentro de su carpeta modular (ej. `src/pages/ventas/mockData.js` o `src/modules/ventas/mockData.js`).
* **Está terminantemente prohibido** crear un único archivo gigante de datos compartido para evitar pisarse en los Pull Requests.
* Los datos mock deben contener de 4 a 10 registros con variedad de estados (ej. Pendiente, En Proceso, Finalizada, Cancelada).

---

### Regla 4: Funcionalidad Mínima Simulada (En Memoria)
* Todas las acciones interactivas (**crear, editar, borrar, buscar, filtrar**) deben resolverse exclusivamente con hooks locales (`useState`) dentro de la pantalla.
* **Cero llamadas a APIs externas** (`fetch`, `axios`). Todo el ciclo de vida de los datos ocurre en memoria.

---

### Regla 5: Validación y Calidad Obligatoria
Al finalizar cualquier modificación o creación de pantalla, el agente o desarrollador debe ejecutar en la terminal:
```bash
npm run lint
npm run build
```
- **Ambos comandos deben finalizar con código de salida 0 (cero errores).**
- Solo cuando la compilación y el linter pasen exitosamente se procede a realizar el commit en Git.

---

## 2. Prompt para Stitch (Generación Visual / UI Mockup)

Copia y pega este prompt en Stitch para generar la estructura visual y los prototipos de pantalla con la identidad correcta:

```text
Actúa como diseñador UI/UX especializado en interfaces de gestión industrial y empresarial (ERP). Necesito diseñar pantallas de prototipo funcional (mockup) para el sistema web de una fábrica de pastas (PastaFab).

Directrices de diseño:
- Framework visual: Basado en componentes estándar de Material-UI (MUI v5/v6).
- Paleta de color:
  * Fondo neutro (#F9FAFB en claro / #121212 en oscuro), tarjetas y contenedores Paper (#FFFFFF / #1E1E1E).
  * Color primario corporativo: Verde italiano (#009246 en claro / #2ECC71 en oscuro).
  * Color secundario: Rojo italiano (#CE2B37 en claro / #E74C3C en oscuro).
- Estructura fija: Contenedor de contenido central sin sidebar integrado (el sidebar ya existe a nivel global en la aplicación).

Composición de cada pantalla:
1. Header de módulo: Título de la vista, breadcrumb y botón principal de acción rápida (ej: "Nueva Orden", "Nuevo Pedido", "Registrar").
2. Barra de filtros: Input de búsqueda rápida (TextField con icono de lupa) y selects simples para filtros de estado.
3. Cuerpo central: Table estructurada con TableContainer y Paper, badges de estado (Chip con colores success, warning, error, default) y columna de acciones (Editar, Eliminar, Ver detalle).
4. Dialogs / Modales: Diseño de formularios en ventanas modales (Dialog) con campos distribuidos en grids de 2 columnas.

Módulo a prototipar: [INDICAR AQUÍ EL MÓDULO Y LA PANTALLA: Ej. Producción - Gestión de Órdenes de Producción]
Genera la vista limpia, con datos de ejemplo realistas pero sin lógica de backend.
```

---

## 3. Prompt para Agentes de IA (Generación de Código React + MUI)

Copia este prompt como instrucción inicial o "System Prompt" en Claude, ChatGPT, Cursor o el agente que utilicen los desarrolladores para programar las pantallas:

```text
Actúa como un Desarrollador Frontend Senior especializado en React (JavaScript puro, JSX) y Material-UI (MUI).

Tu objetivo:
Generar los componentes de vista para una pantalla de un sistema ERP de fábrica de pastas (PastaFab), con funcionalidad interactiva mínima en memoria y sin dependencias de backend.

Reglas técnicas y restricciones estrictas:
1. Stack: React 18+, JSX (NO uses TypeScript, usa archivos .jsx), @mui/material, @mui/icons-material.
2. Cero CSS externo: Todo el estilo debe definirse mediante la prop sx={{ ... }} de MUI o componentes nativos (Box, Grid, Card, Typography, Stack). No agregues clases CSS externas, ni archivos .css ni Tailwind.
3. No toques el Layout global: Asume que la pantalla se renderiza dentro del contenedor gestionado por el layout principal (AppLayout). No agregues Sidebars, Navbars ni wrappers de navegación global.
4. Estado local y Mocking:
   - Crea un array inicial de datos mock dentro del mismo archivo o impórtalo desde ./mockData.js.
   - Implementa la reactividad con useState: filtrado por texto en tiempo real, selector de estado, apertura y cierre de modales (Dialog), confirmaciones de borrado y agregado/edición de nuevos registros en el estado local.
5. Componentes visuales obligatorios:
   - Encabezado con título claro (variant="h5", fontWeight: 700) y botón de acción principal (Button variant="contained" color="primary").
   - Buscador (TextField con SearchIcon) y filtros de estado (Select o Chips).
   - Table dentro de TableContainer y Paper con elevación tenue (elevation={1}) y bordes redondeados (borderRadius: '14px').
   - Estados visuales con <Chip color="{...}" label="{estado}" size="small"/>.
   - Formulario de alta/edición dentro de un <Dialog> con campos de texto (TextField), selectores (Select) y botones de Cancelar y Guardar.
6. Validación obligatoria al finalizar:
   - Ejecuta siempre `npm run lint` y `npm run build` en el proyecto antes de dar por finalizada la tarea.

Especificación de la tarea:
Genera el componente para la pantalla: [NOMBRE DE LA PANTALLA, ej. OrdenProduccionScreen.jsx].

Requerimientos de datos de esta pantalla:
- Entidades involucradas: [LISTAR ENTIDADES, ej: OrdenDeProduccion, ProductoCompuesto, Empleado, Maquinaria]
- Campos de la tabla: [LISTAR CAMPOS, ej: ID, Fecha Emisión, Empleado Asignado, Estado, Acciones]
- Estados posibles a contemplar: [LISTAR ESTADOS, ej: PENDIENTE, EN PROCESO, FINALIZADA, CANCELADA]
```

---

## 4. Custom Skills de Antigravity Disponibles

Este repositorio incluye skills nativas en `.agents/skills/` que se cargan automáticamente tanto en **Antigravity CLI** como en el **Antigravity IDE**:

* **`create-screen`** (`.agents/skills/create-screen/SKILL.md`):  
  Guía al agente paso a paso para crear una vista modular con sus datos mock, componentes MUI estándar, y ejecuta automáticamente `npm run lint` y `npm run build`.
* **`mui-patterns`** (`.agents/skills/mui-patterns/SKILL.md`):  
  Provee snippets y patrones probados para barras de búsqueda, tablas con acciones, modales de formulario y confirmaciones de eliminación.
