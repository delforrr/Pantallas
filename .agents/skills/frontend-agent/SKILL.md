---
name: frontend-agent
description: >-
  Agente de frontend autónomo para PastaFab ERP. Ejecuta workflows de desarrollo UX/UI,
  validación con nuxi/npm lint y build, verificación visual con screenshots/snapshots de Orca ADE,
  control de dependencias y core congelado, y entrega con commits atómicos y push.
---

# Frontend Agent Workflow - PastaFab ERP

Este documento y skill rigen la operativa del **Agente de Frontend**. Su propósito es permitir a cualquier desarrollador desplegar el agente en su rama (`feature/<modulo>`), implementar pantallas y componentes con la máxima calidad y consistencia visual, y validar/entregar el trabajo sin riesgo de colisiones ni roturas del sistema.

---

## 1. Principios y Reglas Inmutables (Enforced by Hooks)

El repositorio cuenta con hooks automáticos activos en `.agents/hooks.json` que vigilan cada acción del agente:

1. **Core Congelado (`src/theme/` y `src/components/layout/`)**:
   - **PROHIBIDO** editar, crear o eliminar archivos en estas carpetas. Cualquier intento será abortado automáticamente por el hook `theme-and-core-guard`.
   - Cada desarrollador debe trabajar **únicamente** dentro de su espacio modular:
     - Ventas: `src/pages/ventas/` y `src/components/ventas/`
     - Compras: `src/pages/compras/` y `src/components/compras/`
     - Producción: `src/pages/produccion/` y `src/components/produccion/`
     - Mantenimiento: `src/pages/mantenimiento/` y `src/components/mantenimiento/`
     - Cliente: `src/pages/cliente/` y `src/components/cliente/`

2. **Control Estricto de Dependencias**:
   - **PROHIBIDO** instalar paquetes externos (`npm i <pkg>`, `yarn add <pkg>`, `pnpm add <pkg>`) o alterar `package.json` a menos que esté formalmente aprobado en el plan de la tarea.
   - El hook `dependency-guard` bloqueará intentos no autorizados.
   - Stack oficial permitido:
     - React 19 + JSX (sin TypeScript)
     - Material-UI v9 (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`)
     - Emotion (`@emotion/react`, `@emotion/styled`)
     - React Router v7 (`react-router-dom`)
     - Vite 8 (`vite`, `@vitejs/plugin-react`)

3. **Cero Hojas de Estilo Externas**:
   - No crear archivos `.css`, `.scss` ni utilizar Tailwind / Bootstrap.
   - Todo estilo visual debe realizarse con la prop `sx={{ ... }}` y componentes nativos de MUI (`Box`, `Grid`, `Stack`, `Paper`, `Card`).
   - Usar tokens semánticos del tema: `primary.main` (verde italiano), `secondary.main` (rojo italiano), `background.paper`, `text.primary`, `divider`.

---

## 2. Workflows del Agente

### Workflow 1: Desarrollo de Features UX/UI & Estado Local
1. **Mock Data Autocontenido (`mockData.js`)**:
   - Crea o expande el archivo `mockData.js` dentro del módulo correspondiente.
   - Provee de 4 a 10 registros con variedad de estados realistas (ej. Pendiente, En Proceso, Finalizada, Cancelada).
2. **Reactividad en Memoria**:
   - Maneja todo el estado (búsquedas, filtros, aperturas de modales, altas, ediciones y bajas) mediante hooks de React (`useState`, `useMemo`).
   - Cero llamadas a APIs externas (`fetch`, `axios`).
3. **Anatomía Obligatoria de Pantalla**:
   - **Header**: Título (`variant="h5"`, `fontWeight: 700`) + Botón de acción principal (`Button variant="contained" color="primary"`).
   - **Filtros**: Buscador con lupa (`TextField` + `SearchIcon`) y selectores/chips de estado.
   - **Cuerpo**: `TableContainer` con `Paper` (`elevation={1}`, `borderRadius: '14px'`), chips de estado con `<Chip color="{...}" size="small"/>`, y columna de acciones (`IconButton` de ver, editar y eliminar).
   - **Dialog de Alta/Edición**: Formulario modal en 2 columnas (`Grid container spacing={2}`) con botones "Cancelar" y "Guardar".
   - **Dialog de Confirmación**: Modal para confirmar borrado en memoria.

---

### Workflow 2: Calidad y Validación Completa (Lint, Build, Tests)
Antes de dar por concluida la codificación, ejecuta el pipeline de validación automatizado:

```powershell
node .agents/scripts/validate-pipeline.cjs
```

Este script ejecuta automáticamente:
1. Verificación de integridad del Core congelado (`src/theme/`, `src/components/layout/`).
2. Verificación de integridad de dependencias en `package.json`.
3. Linter: `npm run lint` (o `npx nuxi typecheck` si el módulo estuviese configurado con Nuxt).
4. Compilación de producción: `npm run build` (o `nuxi build`).
5. Suite de pruebas: `npm test` (si existen pruebas unitarias configuradas).

> **Condición:** Todos los pasos deben finalizar con **código de salida 0 (cero errores)**. Si surge alguna advertencia o error, corrígelo inmediatamente.

---

### Workflow 3: Verificación Visual y E2E con Screenshots (Orca ADE)
Si el entorno cuenta con herramientas de navegación (Orca ADE está disponible y activo en el sistema):

1. **Levantar el entorno de desarrollo**:
   Inicia el servidor local de Vite en segundo plano (o verifica que esté corriendo en `http://localhost:5173`).
2. **Navegar a la pantalla**:
   ```powershell
   orca goto --url "http://localhost:5173/<ruta-de-la-pantalla>" --json
   ```
3. **Validar Accesibilidad y DOM**:
   ```powershell
   orca snapshot --json
   ```
   *Verifica que los inputs, botones y tablas estén presentes en el árbol de accesibilidad.*
4. **Capturar Screenshot**:
   ```powershell
   node .agents/scripts/verify-ui.cjs screenshot "http://localhost:5173/<ruta-de-la-pantalla>"
   ```
   *O ejecuta directamente `orca screenshot --format png --json`.*
5. **Revisión del Screenshot**:
   Verifica contraste de colores, alineación de modales, redondeo de esquinas y visualización correcta tanto en tema claro como oscuro.

---

### Workflow 4: Entrega con Commits Atómicos y Push
Una vez validados el código, el build y la visualización:

1. **Crear Commits Atómicos** siguiendo la convención [Conventional Commits](https://www.conventionalcommits.org/):
   - Separar lógicamente cada etapa del cambio:
     - `feat(<modulo>): agregar mockData y componentes base para <pantalla>`
     - `feat(<modulo>): implementar interfaz de usuario y modales de <pantalla>`
     - `test(<modulo>): validación de compilación, linter y accesibilidad`
   - Ejemplo de comando:
     ```powershell
     git add src/pages/<modulo>/mockData.js src/components/<modulo>/
     git commit -m "feat(<modulo>): agregar componentes base de <pantalla>"
     git add src/pages/<modulo>/<Pantalla>Screen.jsx
     git commit -m "feat(<modulo>): implementar logica en memoria y vista de <pantalla>"
     ```
2. **Pushear la rama**:
   ```powershell
   git push origin <nombre-de-la-rama>
   ```

---

## 3. Checklist Rápido de Aprobación para el Agente

- [ ] ¿Trabajaste exclusivamente dentro de `src/pages/<modulo>/` o `src/components/<modulo>/`?
- [ ] ¿Se mantuvieron intocados `src/theme/` y `src/components/layout/`?
- [ ] ¿Se utilizaron datos mock en memoria (`mockData.js`) sin llamadas `fetch`/`axios`?
- [ ] ¿Todo el estilizado está hecho con `sx={{ ... }}` y tokens de MUI?
- [ ] ¿Se ejecutó `node .agents/scripts/validate-pipeline.cjs` con salida exitosa (código 0)?
- [ ] ¿Se verificó visualmente la pantalla (con Orca screenshot / snapshot)?
- [ ] ¿Se generaron commits atómicos y descriptivos?
- [ ] ¿Se pusheó la rama al repositorio remoto?
