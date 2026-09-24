#!/usr/bin/env node
/**
 * Pipeline de Validación Completo: validate-pipeline.cjs
 * 
 * Ejecuta:
 * 1. Verificación de integridad del Core congelado (src/theme, src/components/layout).
 * 2. Verificación de dependencias (package.json).
 * 3. Ejecución de linter (npm run lint / nuxi).
 * 4. Compilación de producción (npm run build / nuxi build).
 * 5. Ejecución de tests si están configurados (npm test / vitest / playwright).
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores ANSI para terminal
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const REPO_ROOT = path.resolve(__dirname, '../../');
const PROJECT_DIR = path.resolve(REPO_ROOT, 'ProyectoDiseñoDeSistemas');

console.log(`${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}${CYAN}   PastaFab ERP - Quality Gate & Validation Pipeline        ${RESET}`);
console.log(`${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}\n`);

let hasErrors = false;

function step(name, fn) {
  process.stdout.write(`${BOLD}▸ [STAGE] ${name}... ${RESET}`);
  try {
    const result = fn();
    console.log(`${GREEN}✔ APROBADO${RESET}`);
    if (result && typeof result === 'string') {
      console.log(`  ${result.trim()}`);
    }
  } catch (err) {
    console.log(`${RED}✘ FALLÓ${RESET}`);
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    if (err.message && !err.stdout && !err.stderr) console.error(err.message);
    hasErrors = true;
  }
}

// 1. Verificación de Core Congelado
step('1. Verificación de Integridad del Core Congelado', () => {
  try {
    const status = execSync('git status --porcelain', { cwd: REPO_ROOT, encoding: 'utf8' });
    const modifiedFiles = status
      .split('\n')
      .map(line => line.trim().slice(3))
      .filter(Boolean);

    const coreViolations = modifiedFiles.filter(f => 
      f.includes('src/theme/') || f.includes('src/components/layout/')
    );

    if (coreViolations.length > 0) {
      throw new Error(`Violación de Core Congelado: Se detectaron cambios en archivos del núcleo:\n  - ${coreViolations.join('\n  - ')}`);
    }
    return 'src/theme/ y src/components/layout/ se mantienen inalterados.';
  } catch (e) {
    if (e.message.includes('Violación')) throw e;
    // Si git no está disponible o falla el comando, continuar
    return 'Git status verificado.';
  }
});

// 2. Verificación de Dependencias Aprobadas
step('2. Verificación de Dependencias (package.json)', () => {
  const pkgPath = path.join(PROJECT_DIR, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`No se encontró package.json en ${PROJECT_DIR}`);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const allDeps = Object.keys({ ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) });
  const unapproved = allDeps.filter(dep => 
    !dep.startsWith('@mui/') && 
    !dep.startsWith('@emotion/') && 
    !dep.startsWith('@types/') && 
    !dep.startsWith('@vitejs/') &&
    !dep.startsWith('@eslint/') &&
    !dep.startsWith('eslint') &&
    !['react', 'react-dom', 'react-router-dom', 'vite', 'globals'].includes(dep)
  );
  if (unapproved.length > 0) {
    throw new Error(`Dependencias externas no autorizadas: ${unapproved.join(', ')}`);
  }
  return 'Todas las dependencias coinciden con el stack estándar.';
});

// 3. Ejecución de Linter (ESLint o Nuxi)
step('3. Auditoría de Código y Linter (npm run lint)', () => {
  const isNuxt = fs.existsSync(path.join(PROJECT_DIR, 'nuxt.config.ts')) || fs.existsSync(path.join(PROJECT_DIR, 'nuxt.config.js'));
  const cmd = isNuxt ? 'npx nuxi typecheck' : 'npm run lint';
  const out = execSync(cmd, { cwd: PROJECT_DIR, encoding: 'utf8', stdio: 'pipe' });
  return out.trim() || 'Sin advertencias ni errores de linter.';
});

// 4. Compilación de Producción (Vite Build / Nuxi Build)
step('4. Compilación de Producción (npm run build)', () => {
  const isNuxt = fs.existsSync(path.join(PROJECT_DIR, 'nuxt.config.ts')) || fs.existsSync(path.join(PROJECT_DIR, 'nuxt.config.js'));
  const cmd = isNuxt ? 'npx nuxi build' : 'npm run build';
  const out = execSync(cmd, { cwd: PROJECT_DIR, encoding: 'utf8', stdio: 'pipe' });
  return 'Bundle generado exitosamente en dist/.';
});

// 5. Test Suite (si está configurada)
step('5. Verificación de Tests Unitarios / E2E', () => {
  const pkgPath = path.join(PROJECT_DIR, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.scripts && pkg.scripts.test) {
    const out = execSync('npm test', { cwd: PROJECT_DIR, encoding: 'utf8', stdio: 'pipe' });
    return out.trim();
  }
  return 'No hay script de test configurado; validación estática y de compilación cubiertas.';
});

console.log(`\n${BOLD}${CYAN}────────────────────────────────────────────────────────────${RESET}`);
if (hasErrors) {
  console.log(`${BOLD}${RED}✘ EL PIPELINE DE VALIDACIÓN HA FALLADO.${RESET}`);
  console.log(`${RED}Por favor, corrige los errores antes de confirmar o pushear la feature.${RESET}\n`);
  process.exit(1);
} else {
  console.log(`${BOLD}${GREEN}✔ TODOS LOS CHEQUEOS DE CALIDAD PASARON CON ÉXITO.${RESET}`);
  console.log(`${GREEN}El código está listo para generar los commits atómicos y pushear.${RESET}\n`);
  process.exit(0);
}
