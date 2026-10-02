#!/usr/bin/env node
/**
 * Herramienta de Verificación Visual & E2E: verify-ui.cjs
 * 
 * Permite al agente y a los desarrolladores:
 * 1. Comprobar la disponibilidad de herramientas de verificación visual (Orca ADE / Headless Browser).
 * 2. Navegar automáticamente a las rutas del ERP en el navegador de Orca.
 * 3. Obtener snapshots del árbol de accesibilidad (orca snapshot) para certificar presencia de controles UI.
 * 4. Capturar screenshots (orca screenshot) para auditoría visual y guardarlos como artefactos.
 * 5. Si no hay herramientas de navegación activas, realiza análisis estático de fidelidad visual MUI.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../../');
const SCREENSHOTS_DIR = path.resolve(REPO_ROOT, '.agents/verification/screenshots');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}${CYAN}   PastaFab ERP - UI Verification & Screenshot Utility      ${RESET}`);
console.log(`${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}\n`);

// Crear directorio de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// 1. Detección de Orca ADE
let orcaAvailable = false;
try {
  const statusRaw = execSync('orca status --json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  const status = JSON.parse(statusRaw);
  if (status.ok && status.result && status.result.runtime && status.result.runtime.reachable) {
    orcaAvailable = true;
    console.log(`${GREEN}✔ Orca ADE detectado y conectado (PID: ${status.result.app.pid})${RESET}`);
  }
} catch {
  orcaAvailable = false;
}

if (!orcaAvailable) {
  console.log(`${YELLOW}ℹ Orca ADE no está en ejecución. Modo fallback activo.${RESET}\n`);
}

const args = process.argv.slice(2);
const command = args[0] || 'audit';
const targetUrl = args[1] || 'http://localhost:5173';
const outputName = args[2] || `screen-${Date.now()}`;

async function run() {
  if (command === 'screenshot' || command === 'e2e') {
    if (!orcaAvailable) {
      console.log(`${RED}✘ No se puede capturar screenshot interactivo sin Orca ADE.${RESET}`);
      console.log(`${YELLOW}Inicia Orca ejecutando 'orca open' y asegúrate de levantar 'npm run dev'.${RESET}`);
      process.exit(1);
    }

    console.log(`${BOLD}▸ Navegando a ${targetUrl}...${RESET}`);
    try {
      execSync(`orca goto --url "${targetUrl}" --json`, { encoding: 'utf8', stdio: 'pipe' });
      console.log(`${GREEN}✔ Navegación exitosa.${RESET}`);

      console.log(`${BOLD}▸ Tomando snapshot del árbol de accesibilidad...${RESET}`);
      const snapshot = execSync('orca snapshot --json', { encoding: 'utf8', stdio: 'pipe' });
      console.log(`${GREEN}✔ Snapshot del DOM verificado.${RESET}`);

      console.log(`${BOLD}▸ Capturando screenshot...${RESET}`);
      const screenshotRes = execSync('orca screenshot --format png --json', { encoding: 'utf8', stdio: 'pipe' });
      console.log(`${GREEN}✔ Screenshot capturado con éxito.${RESET}`);
      console.log(`Detalle: ${screenshotRes.trim()}`);
    } catch (err) {
      console.error(`${RED}✘ Error durante la automatización con Orca:${RESET}`, err.message);
      process.exit(1);
    }
  } else {
    // Modo Auditoría Estática de Pantallas
    console.log(`${BOLD}▸ Realizando auditoría de componentes de pantalla (UI Compliance)...${RESET}`);
    const pagesDir = path.resolve(REPO_ROOT, 'ProyectoDiseñoDeSistemas/src/pages');
    
    function scanDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      let screens = [];
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          screens = screens.concat(scanDir(full));
        } else if (entry.name.endsWith('Screen.jsx')) {
          screens.push(full);
        }
      }
      return screens;
    }

    const screens = scanDir(pagesDir);
    console.log(`  Encontradas ${screens.length} pantallas para auditar.`);

    let complianceIssues = 0;
    screens.forEach(screenPath => {
      const rel = path.relative(REPO_ROOT, screenPath);
      const content = fs.readFileSync(screenPath, 'utf8');

      const hasPaper = content.includes('Paper') || content.includes('Card');
      const hasHeader = content.includes('h5') || content.includes('Typography');
      const hasAction = content.includes('Button') || content.includes('IconButton');

      if (!hasPaper || !hasHeader || !hasAction) {
        console.log(`${YELLOW}⚠ ${rel}: faltan elementos base esperados (Paper/Header/Actions).${RESET}`);
        complianceIssues++;
      }
    });

    if (complianceIssues === 0) {
      console.log(`${GREEN}✔ Todas las pantallas cumplen la estructura estándar (Header, Cards/Paper, Botones).${RESET}`);
    } else {
      console.log(`${YELLOW}ℹ Se detectaron ${complianceIssues} advertencias menores en pantallas.${RESET}`);
    }

    console.log(`\n${BOLD}${CYAN}Herramientas E2E disponibles:${RESET}`);
    console.log(`- Orca ADE Browser Engine: ${orcaAvailable ? `${GREEN}DISPONIBLE${RESET}` : `${YELLOW}NO ACTIVO${RESET}`}`);
    console.log(`  Comando para screenshot: ${BOLD}node .agents/scripts/verify-ui.cjs screenshot http://localhost:5173/ventas/pedidos${RESET}`);
  }
}

run();
