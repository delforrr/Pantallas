# Lineamientos para Agentes de IA y Estrategia de Equipo (PastaFab ERP)

Este documento define la **estrategia de trabajo colaborativo**, la **arquitectura modular estricta**, las **políticas de hooks de seguridad** y los **workflows del agente de frontend** para que desarrolladores y agentes de IA (Antigravity, Cursor, Claude Code, ChatGPT, Copilot, etc.) construyan pantallas sin colisiones, disparidades visuales ni *merge conflicts*.

---

## 1. Estrategia de Equipo & Core Congelado

Para garantizar consistencia visual y evitar conflictos de fusión entre los módulos de **Ventas**, **Compras**, **Producción**, **Mantenimiento** y **Cliente**:

### Regla 1: El Core está Congelado en `main` y `develop`
Los siguientes directorios constituyen el **núcleo inmutable** de la aplicación:
1. **El tema de Material-UI (`src/theme/`)**: Paleta corporativa estándar (verde italiano `#009246` / `#2ECC71`, rojo `#CE2B37` / `#E74C3C`, fondos neutros y tipografía *Inter/Roboto*).
2. **El contenedor global (`src/components/layout/`)**: `AppSidebar`, `AppHeader` y el área de contenido principal / `<Outlet/>` o layout de React Router.
3. **Dependencias del proyecto (`package.json`)**: Stack tecnológico congelado y homologado.

> [!CAUTION]
> **ESTRICTAMENTE PROHIBIDO MODIFICAR EL CORE**  
> Ningún agente ni desarrollador tiene autorización para modificar archivos dentro de `src/theme/`, `src/components/layout/` o agregar paquetes a `package.json`.  
> Esta regla es auditada y bloqueada en tiempo real mediante los **Hooks de Seguridad** del repositorio.

---

### Regla 2: Estructura Modular Estricta (*Package by Feature*)
Cada integrante debe trabajar **únicamente dentro de su carpeta modular asignada**:

```plaintext
src/
├── theme/                 # ❄ CONGELADO (Paleta institucional, overrides globales)
├── components/
│   ├── layout/            # ❄ CONGELADO (AppLayout, AppSidebar, AppHeader)
│   ├── shared/            # Componentes compartidos comunes
│   ├── ventas/            # Componentes específicos de Ventas
│   ├── compras/           # Componentes específicos de Compras
│   ├── produccion/        # Componentes específicos de Producción
│   ├── mantenimiento/     # Componentes específicos de Mantenimiento
│   └── cliente/           # Componentes específicos del Portal Cliente
├── pages/
│   ├── ventas/            # Rama: feature/ventas
│   ├── compras/           # Rama: feature/compras
│   ├── produccion/        # Rama: feature/produccion
│   ├── mantenimiento/     # Rama: feature/mantenimiento
│   └── cliente/           # Rama: feature/cliente
```

---

### Regla 3: Datos Simulados Autocontenidos (`mockData.js`)
* Cada módulo debe tener su propio archivo `mockData.js` dentro de su carpeta modular (ej. `src/pages/ventas/mockData.js`).
* **Está terminantemente prohibido** crear un único archivo gigante de datos compartido para evitar colisiones en los Pull Requests.
* Los datos mock deben contener de 4 a 10 registros con variedad de estados (ej. Pendiente, En Proceso, Finalizada, Cancelada).

---

### Regla 4: Funcionalidad Mínima Simulada (En Memoria)
* Todas las acciones interactivas (**crear, editar, borrar, buscar, filtrar**) deben resolverse exclusivamente con hooks locales (`useState`, `useMemo`) dentro de la pantalla.
* **Cero llamadas a APIs externas** (`fetch`, `axios`). Todo el ciclo de vida de los datos ocurre en memoria.

---

### Regla 5: Calidad Obligatoria, Validación E2E, Commits Atómicos y Push
Al finalizar cualquier feature:
1. Ejecutar el pipeline de calidad: `node .agents/scripts/validate-pipeline.cjs` (o `npm run lint` && `npm run build`).
2. Realizar verificación visual con screenshots mediante Orca ADE (`node .agents/scripts/verify-ui.cjs screenshot <url>`).
3. Generar **commits atómicos** siguiendo Conventional Commits (`feat(modulo): ...`, `test(modulo): ...`).
4. Pushear la rama al repositorio remoto (`git push origin <rama>`).

---

## 2. Hooks de Seguridad Automatizados (`.agents/hooks.json`)

El repositorio cuenta con hooks de ciclo de vida nativos que interceptan las llamadas a herramientas de los agentes para garantizar las directrices:

1. **`theme-and-core-guard` (`PreToolUse` sobre escritura y edición de archivos)**:
   - Bloquea cualquier intento de escribir o editar archivos en `src/theme/` y `src/components/layout/`.
   - Bloquea la creación de hojas de estilo externas (`.css`, `.scss`, `.sass`, etc.). Todo el estilo debe definirse mediante `sx={{ ... }}` en Material-UI.
   - Valida el respeto a las convenciones y tokens de color del tema corporativo.
2. **`dependency-guard` (`PreToolUse` sobre comandos y package.json)**:
   - Bloquea comandos de instalación de librerías externas (`npm install <pkg>`, `yarn add`, `pnpm add`, etc.).
   - Bloquea modificaciones no autorizadas en `package.json`.
   - Garantiza que solo se utilice el stack oficial: React 19, `@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `react-router-dom`, Emotion y Vite.

---

## 3. Workflows del Agente de Frontend (`frontend_agent`)

El agente `frontend_agent` está registrado y configurado para ejecutar los siguientes 4 workflows:

### Workflow 1: Desarrollo UX/UI de Features
- Lectura de requerimientos y aislamiento en la carpeta del módulo.
- Creación/ampliación de `mockData.js` con datos representativos.
- Composición con componentes estándar de Material-UI:
  - Header de pantalla con título (`variant="h5"`, `fontWeight: 700`) y botón de acción (`Button variant="contained"`).
  - Barra de búsqueda (`TextField` con `SearchIcon`) y filtros de estado (`Select` o `Chip`).
  - Tabla de datos con `TableContainer` y `Paper` (`elevation={1}`, `borderRadius: '14px'`), chips de estado y columna de acciones.
  - Formulario de alta/edición en modal `Dialog` con layout de 2 columnas (`Grid container spacing={2}`).
  - Modal `Dialog` de confirmación para eliminaciones lógicas en memoria.

### Workflow 2: Validación Integral de Calidad
- Ejecución de `node .agents/scripts/validate-pipeline.cjs`:
  - Valida inmutabilidad del core congelado.
  - Valida integridad de dependencias.
  - Ejecuta linter (`npm run lint`).
  - Ejecuta compilación (`npm run build`).
  - Ejecuta suite de tests unitarios o estáticos.
- Cero tolerancia a errores: código de salida debe ser 0.

### Workflow 3: Verificación Visual y E2E con Screenshots (Orca ADE)
- Verificación del runtime de Orca ADE: `orca status --json`.
- Si Orca está activo:
  - Levantar servidor de desarrollo (`npm run dev` en segundo plano).
  - Navegación automatizada: `orca goto --url "http://localhost:5173/<modulo>/<pantalla>"`
  - Snapshot de accesibilidad y DOM: `orca snapshot --json`
  - Captura de pantalla: `node .agents/scripts/verify-ui.cjs screenshot "http://localhost:5173/<modulo>/<pantalla>"`
  - Auditoría del screenshot para verificar márgenes, contrastes, tema claro/oscuro y componentes.
- Si Orca no está activo: ejecución de auditoría estática con `node .agents/scripts/verify-ui.cjs audit`.

### Workflow 4: Commits Atómicos y Push
- Creación de commits atómicos y semánticos:
  ```bash
  git add src/pages/<modulo>/mockData.js src/components/<modulo>/
  git commit -m "feat(<modulo>): agregar componentes base y mockData para <pantalla>"
  git add src/pages/<modulo>/<Pantalla>Screen.jsx
  git commit -m "feat(<modulo>): implementar logica en memoria y vista de <pantalla>"
  git add .agents/
  git commit -m "test(<modulo>): validaciones de linter, build y verificacion visual E2E"
  ```
- Push de la rama al remoto:
  ```bash
  git push origin feature/<modulo>-<nombre>
  ```

---

## 4. Guía para Desarrolladores: Cómo Desplegar el Agente en tu Branch

1. **Crear tu rama de feature desde `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/<modulo>-<nombre-feature>
   ```
2. **Iniciar Antigravity**:
   Al abrir la rama en Antigravity (CLI o IDE), Antigravity detectará automáticamente las configuraciones de `.agents/`:
   - Se activarán los hooks de `.agents/hooks.json` protegiendo el core y las dependencias.
   - La skill `frontend-agent` estará lista para usarse.
3. **Invocar al Agente de Frontend**:
   Puedes solicitarle al agente:
   > *"Implementa la pantalla de Pedidos de Ventas siguiendo el workflow de frontend-agent."*
   El agente ejecutará el desarrollo, el pipeline de validación, la captura de screenshots con Orca, y finalizará generando los commits atómicos y realizando el push.

---

## 5. Custom Skills Disponibles en `.agents/skills/`

* **`frontend-agent`** (`.agents/skills/frontend-agent/SKILL.md`):  
  Skill principal del agente de frontend con los 4 workflows completos (UX/UI, pipeline de validación, screenshots Orca, commits atómicos y push).
* **`create-screen`** (`.agents/skills/create-screen/SKILL.md`):  
  Guía técnica paso a paso para la maquetación de pantallas modulares con MUI.
* **`mui-patterns`** (`.agents/skills/mui-patterns/SKILL.md`):  
  Snippets de referencia para tablas con paginación, modales en 2 columnas, chips de estado y modales de confirmación.
