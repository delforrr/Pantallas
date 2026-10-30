import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import getTheme from '../../theme/theme.js';

test('abrir remitos sin total no renderiza el formulario de pago cerrado', async () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url));
  const cache = path.join(root, 'node_modules/.cache');
  await mkdir(cache, { recursive: true });
  const directory = await mkdtemp(path.join(cache, 'receipt-render-'));
  try {
    const output = await build({
      root, logLevel: 'silent',
      build: { ssr: 'src/pages/compras/FacturasRemitosScreen.jsx', write: false, minify: false },
      plugins: [{
        name: 'receipt-render-fixtures', enforce: 'pre',
        transform(source, id) {
          if (id.endsWith('/pages/compras/FacturasRemitosScreen.jsx')) {
            return source.replace('FacturasRemitosScreen = () => {', 'FacturasRemitosScreen = ({ document, type, paying = false }) => {')
              .replace('const [selectedItem, setSelectedItem] = useState(null)', 'const [selectedItem, setSelectedItem] = useState(document)')
              .replace('const [detailType, setDetailType] = useState("factura")', 'const [detailType, setDetailType] = useState(type)')
              .replace('const [openDetail, setOpenDetail] = useState(false)', 'const [openDetail, setOpenDetail] = useState(!paying)')
              .replace('const [openPagarFactura, setOpenPagarFactura] = useState(false)', 'const [openPagarFactura, setOpenPagarFactura] = useState(paying)')
              + '\nexport { initialReceptionState, INITIAL_FACTURAS, INITIAL_COMPROBANTES_PAGO };';
          }
          // Portals have no DOM target in a server render.
          if (id.endsWith('/components/compras/ModuleUI.jsx')) return source.replace('<MuiDialog {...props}', '<MuiDialog disablePortal {...props}');
        }
      }]
    });
    const chunk = output.output.find(item => item.type === 'chunk' && item.isEntry);
    const filename = path.join(directory, 'screen.mjs');
    await writeFile(filename, chunk.code);
    const { default: Screen, initialReceptionState, INITIAL_FACTURAS, INITIAL_COMPROBANTES_PAGO } = await import(pathToFileURL(filename));
    const render = props => renderToStaticMarkup(createElement(ThemeProvider, { theme: getTheme('light') }, createElement(Screen, props)));
    for (const document of initialReceptionState().remitos) {
      const html = render({ document, type: 'remito' });
      assert.ok(html.includes(document.id));
      assert.ok(html.includes('Cantidad recibida'));
      assert.ok(!html.includes('Factura a Cancelar'));
    }
    assert.ok(render({ document: INITIAL_FACTURAS[0], type: 'factura' }).includes('Factura de proveedor'));
    assert.ok(render({ document: INITIAL_COMPROBANTES_PAGO[0], type: 'pago' }).includes('Comprobante de pago'));
    assert.ok(render({ document: INITIAL_FACTURAS[0], type: 'factura', paying: true }).includes('Factura a Cancelar'));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
