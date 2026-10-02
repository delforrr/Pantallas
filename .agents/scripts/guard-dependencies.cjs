#!/usr/bin/env node
/**
 * Hook de Seguridad: guard-dependencies.cjs
 * 
 * Valida:
 * 1. Prohibición de agregar dependencias, librerías o frameworks externos vía línea de comandos (npm, yarn, pnpm, bun)
 *    a menos que esté explícitamente previsto en el plan.
 * 2. Prohibición de modificar package.json para inyectar nuevas dependencias no autorizadas.
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

// Dependencias base aprobadas para el proyecto
const APPROVED_STACK = [
  'react',
  'react-dom',
  'react-router-dom',
  '@mui/material',
  '@mui/icons-material',
  '@mui/x-data-grid',
  '@emotion/react',
  '@emotion/styled',
  'vite',
  '@vitejs/plugin-react',
  'eslint'
];

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

    // 1. VERIFICACIÓN EN run_command
    if (toolName === 'run_command') {
      const commandLine = (args.CommandLine || '').trim();

      // Detectar comandos de instalación que incluyan nombres de paquetes
      // Ejemplos detectados:
      // npm install axios
      // npm i -D tailwindcss
      // yarn add lodash
      // pnpm add date-fns
      // bun add zustand
      const installPkgRegex = /\b(npm\s+(i|install|add)|yarn\s+add|pnpm\s+(add|i)|bun\s+add)\s+([^\s-]+[^\s]*)/i;
      
      if (installPkgRegex.test(commandLine)) {
        // Excluir si solo es restauración de dependencias ya existentes (ej. 'npm install', 'npm ci')
        // El regex busca si después de 'install' o 'i' viene un nombre de paquete (que no empiece por '-')
        const match = commandLine.match(installPkgRegex);
        const potentialPkg = match ? match[4] : '';

        // Si el argumento es un flag (ej. --legacy-peer-deps, --dry-run), se ignora
        const isFlagOnly = potentialPkg.startsWith('-');

        if (!isFlagOnly) {
          respond(
            'deny',
            `❌ [CONTROL DE DEPENDENCIAS] Bloqueada la instalación del paquete '${potentialPkg}'.\n` +
            `Está estrictamente prohibido agregar librerías o dependencias externas sin aprobación explícita en el plan de la feature.\n` +
            `Stack oficial autorizado: ${APPROVED_STACK.join(', ')}.\n` +
            `Si justificas el uso de una nueva dependencia, documéntala en el plan y solicita confirmación previa.`
          );
          return;
        }
      }

      respond('allow');
      return;
    }

    // 2. VERIFICACIÓN EN write_to_file / replace_file_content SOBRE package.json
    if (toolName === 'write_to_file' || toolName === 'replace_file_content') {
      const targetFile = (args.TargetFile || '').replace(/\\/g, '/');

      if (targetFile.endsWith('/package.json')) {
        const newContent = args.CodeContent || args.ReplacementContent || '';
        
        // Si se intenta modificar package.json, validar que no agregue librerías fuera del stack
        try {
          if (newContent) {
            const parsed = JSON.parse(newContent);
            const allDeps = {
              ...(parsed.dependencies || {}),
              ...(parsed.devDependencies || {})
            };

            const unapproved = Object.keys(allDeps).filter(
              dep => !APPROVED_STACK.some(approved => dep === approved || dep.startsWith('@types/') || dep.startsWith('@eslint/') || dep.startsWith('eslint-plugin-') || dep === 'globals')
            );

            if (unapproved.length > 0) {
              respond(
                'deny',
                `❌ [CONTROL DE DEPENDENCIAS] Se detectaron dependencias no autorizadas en package.json: ${unapproved.join(', ')}.\n` +
                `No se pueden introducir librerías externas que no formen parte del stack acordado para el equipo.`
              );
              return;
            }
          }
        } catch {
          // Si no es JSON completo (ej. replace_file_content), bloquear ediciones arbitrarias en dependencias
          if (/(dependencies|devDependencies)/i.test(newContent)) {
            respond(
              'deny',
              `❌ [CONTROL DE DEPENDENCIAS] Edición en bloque de dependencias en package.json bloqueada.\n` +
              `Cualquier nueva dependencia debe estar explícitamente justificada y aprobada en el plan.`
            );
            return;
          }
        }
      }

      respond('allow');
      return;
    }

    respond('allow');
  } catch (err) {
    respond('allow');
  }
}

main();
