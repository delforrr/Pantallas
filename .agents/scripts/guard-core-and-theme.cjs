#!/usr/bin/env node
/**
 * Hook de Seguridad: guard-core-and-theme.cjs
 * 
 * Valida:
 * 1. Congelamiento del Core: Bloquea cualquier modificación o creación de archivos en src/theme/ y src/components/layout/.
 * 2. Convención de Estilos: Bloquea la creación de hojas de estilo externas (.css, .scss, etc.).
 * 3. Convenciones de Tema: Asegura que los componentes usen la paleta y tokens de MUI.
 */

const fs = require('fs');
const path = require('path');

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

function respond(decision, reason) {
  const response = { decision };
  if (reason) {
    response.reason = reason;
  }
  process.stdout.write(JSON.stringify(response));
  process.exit(0);
}

async function main() {
  try {
    const rawInput = await readStdin();
    if (!rawInput || !rawInput.trim()) {
      respond('allow');
      return;
    }

    let payload;
    try {
      payload = JSON.parse(rawInput);
    } catch {
      respond('allow');
      return;
    }

    const toolCall = payload.toolCall || {};
    const toolName = toolCall.name || '';
    const args = toolCall.args || {};

    // Solo interceptamos herramientas de escritura/modificación de archivos
    if (toolName !== 'write_to_file' && toolName !== 'replace_file_content') {
      respond('allow');
      return;
    }

    const targetFile = args.TargetFile || '';
    if (!targetFile) {
      respond('allow');
      return;
    }

    const normalized = targetFile.replace(/\\/g, '/');

    // 1. REGLA: CONGELAMIENTO DEL CORE
    // src/theme/ y src/components/layout/ están estrictamente congelados
    const isCoreTheme = /\/src\/theme(\/|$)/i.test(normalized);
    const isCoreLayout = /\/src\/components\/layout(\/|$)/i.test(normalized);

    if (isCoreTheme || isCoreLayout) {
      const folderName = isCoreTheme ? 'src/theme/' : 'src/components/layout/';
      respond(
        'deny',
        `❌ [CORE CONGELADO] No está permitido modificar ni crear archivos dentro de '${folderName}'.\n` +
        `El Core del sistema ha sido congelado en la rama principal para garantizar consistencia y evitar conflictos de fusión.\n` +
        `Desarrolla tus componentes exclusivamente dentro de tu módulo asignado (ej. 'src/pages/<modulo>/' o 'src/components/<modulo>/').`
      );
      return;
    }

    // 2. REGLA: CERO CSS EXTERNO / SIN HOJAS DE ESTILO PROPIAS
    // No permitir crear archivos .css, .scss, .sass, .less en los módulos
    const isExternalStyle = /\.(scss|sass|less|styl)$/i.test(normalized) ||
      (/\.css$/i.test(normalized) && !normalized.endsWith('/src/index.css') && !normalized.endsWith('/src/App.css'));

    if (isExternalStyle) {
      respond(
        'deny',
        `❌ [CONVENCIÓN DE ESTILOS] Está prohibido crear o modificar archivos de hojas de estilo externos (${path.extname(targetFile)}).\n` +
        `Todo el estilo debe implementarse mediante la prop sx={{ ... }} de Material-UI o componentes de maquetado nativos (@mui/material Box, Grid, Stack, Paper).`
      );
      return;
    }

    // 3. REGLA: CONVENCIONES DEL TEMA Y PALETA
    // Comprobar si el contenido intenta importar librerías CSS ajenas o patrones no permitidos
    const contentToCheck = args.CodeContent || args.ReplacementContent || '';
    if (contentToCheck) {
      // Bloquear frameworks css invasivos
      if (/(import\s+['"].*\.css['"])|(className=['"](btn|tw-|tailwind))/i.test(contentToCheck)) {
        respond(
          'deny',
          `❌ [CONVENCIÓN DE ESTILOS] Se detectó uso de clases CSS externas o importación de CSS en el componente.\n` +
          `Utiliza exclusivamente componentes y propiedades de Material-UI (sx={{ ... }}).`
        );
        return;
      }
    }

    // Si supera todas las reglas, permitir
    respond('allow');
  } catch (err) {
    // Si ocurre un error inesperado en el script, permitir para no trabar el ciclo
    respond('allow');
  }
}

main();
