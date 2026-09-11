---
name: create-screen
description: Procedimiento paso a paso para crear o actualizar pantallas y vistas de módulos en React + Material-UI (MUI) siguiendo la estrategia de equipo y package-by-feature. Úsalo cuando el usuario pida diseñar, programar o maquetar una pantalla para ventas, compras, producción, mantenimiento o cliente.
---

# Workflow: Creación de Pantallas Modulares (PastaFab ERP)

Sigue este procedimiento estricto para crear cualquier vista del sistema evitando conflictos de fusión (*merge conflicts*) y garantizando consistencia visual y técnica.

---

## 1. Reglas de Arquitectura y Aislamiento

1. **Ubicación Aislada (Package by Feature)**:
   - Todo código nuevo debe crearse **exclusivamente** dentro de la carpeta del módulo correspondiente:
     - `src/modules/ventas/` o `src/pages/ventas/` + `src/components/ventas/`
     - `src/modules/compras/` o `src/pages/compras/` + `src/components/compras/`
     - `src/modules/produccion/` o `src/pages/produccion/` + `src/components/produccion/`
     - `src/modules/mantenimiento/` o `src/pages/mantenimiento/` + `src/components/mantenimiento/`
     - `src/modules/cliente/` o `src/pages/cliente/` + `src/components/cliente/`
   - **PROHIBIDO** modificar `src/theme/`, `src/components/layout/` o componentes de otros módulos salvo acuerdo explícito de equipo.

2. **Datos Simulados (`mockData.js`)**:
   - Cada módulo debe definir sus propios datos en un archivo `mockData.js` local a su carpeta modular.
   - Proporciona entre 4 y 10 registros realistas con todos los estados posibles del negocio.

3. **Interactividad Local (`useState`)**:
   - Resuelve altas, bajas, ediciones, búsquedas por texto y filtrados por estado en memoria usando `useState`.
   - Cero llamadas a APIs externas (`fetch`, `axios`).

---

## 2. Anatomía Obligatoria de Cada Pantalla

Cada pantalla debe componerse con componentes estándar de MUI:

1. **Header de Vista**:
   - Título de la vista (`variant="h5"` con `fontWeight: 700`).
   - Botón de acción principal con icono (ej. `Button` `contained` "Nueva Orden" / "Nuevo Registro").
2. **Barra de Búsqueda y Filtros**:
   - Campo de búsqueda rápido (`TextField` con `SearchIcon` en `InputProps`).
   - Filtros de estado usando `Select` o grupo de `Chip` clicables.
3. **Cuerpo Central (Tabla o Grilla)**:
   - `TableContainer` con componente `Paper` (`elevation={1}`, bordes redondeados `borderRadius: '14px'`).
   - Columnas claras, badges de estado con `<Chip size="small" color="{success|warning|error|info|default}" label="{estado}" />`.
   - Columna de acciones con `IconButton` (`VisibilityIcon`, `EditIcon`, `DeleteIcon`).
4. **Modal de Alta / Edición (`Dialog`)**:
   - Formulario en modal con campos distribuidos en grilla de 2 columnas (`Grid container spacing={2}`).
   - Botones de acción "Cancelar" y "Guardar".
5. **Modal de Confirmación de Borrado**:
   - `Dialog` breve para confirmar eliminación lógica en memoria.

---

## 3. Estilos y Código

- **JSX puro** (archivos `.jsx`). No usar TypeScript.
- **Cero CSS externo**: Utilizar únicamente la prop `sx={{ ... }}` y componentes de `@mui/material`.
- Utilizar los colores del tema: `primary.main` (verde italiano), `secondary.main` (rojo italiano), `background.paper`, `text.primary`, `divider`.

---

## 4. Validación Final Obligatoria

Al terminar de crear o modificar la pantalla, ejecuta siempre:
```bash
npm run lint
npm run build
```
Si se reporta algún error de linter o compilación, corrígelo de inmediato. Solo cuando ambos comandos salgan con código 0 se considerará terminada la tarea.
