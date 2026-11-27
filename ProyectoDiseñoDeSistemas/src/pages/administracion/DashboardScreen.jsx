import { useState } from 'react';
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useApp } from '../../context/AppContext';
import {
  alertas, categorias, cobrosPorTipo, entregas, FECHA_DEMO,
  fechaVisible, mesesCobros, moneda, porcentaje,
} from './dashboardData';

const panel = {
  borderRadius: '12px',
  bgcolor: 'background.paper',
  backgroundImage: 'none',
  borderColor: 'divider',
  p: { xs: 2, sm: 2.5 },
};

const coloresCobros = ['primary.main', 'text.secondary', 'primary.dark', 'text.primary', 'action.disabled'];
const resumenPendientes = 4;

function Acceso({ destino, children, etiqueta }) {
  const { navigate } = useApp();
  return (
    <Button
      color="inherit"
      endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
      onClick={() => navigate(destino)}
      aria-label={etiqueta}
      sx={{ alignSelf: 'flex-start', whiteSpace: 'nowrap', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}
    >
      {children}
    </Button>
  );
}

function Pendientes() {
  const [mostrarTodo, setMostrarTodo] = useState(false);
  const visibles = mostrarTodo ? alertas : alertas.slice(0, resumenPendientes);
  return (
    <Paper component="section" variant="outlined" aria-labelledby="pendientes-titulo" sx={panel}>
      <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
        <Typography id="pendientes-titulo" component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>Pendientes de hoy</Typography>
        <Typography variant="body2" color="text.secondary">{alertas.length} {alertas.length === 1 ? 'alerta' : 'alertas'}</Typography>
      </Stack>
      <Box component="ul" id="pendientes-lista" sx={{ p: 0, m: 0, mt: 1, listStyle: 'none' }}>
        {visibles.map((alerta) => (
          <Box component="li" key={alerta.referencia} sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr) auto', sm: 'minmax(0, 1fr) minmax(0, 0.9fr) auto' },
            alignItems: 'center', columnGap: { xs: 1, sm: 3 }, rowGap: 0.25, py: { xs: 1.25, sm: 0.5 },
            borderTop: '1px solid', borderColor: 'divider',
          }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{alerta.nombre}</Typography>
              <Typography variant="caption" color="text.secondary">{alerta.referencia}</Typography>
            </Box>
            <Box sx={{ gridColumn: { xs: 1, sm: 2 }, gridRow: { xs: 2, sm: 1 }, minWidth: 0 }}>
              <Typography variant="body2" sx={{
                fontWeight: 600,
                color: alerta.prioridad === 0
                  ? (theme) => theme.palette.mode === 'dark' ? theme.palette.error.light : theme.palette.error.dark
                  : 'text.primary',
              }}>{alerta.estado}</Typography>
              <Typography variant="caption" color="text.secondary">{alerta.detalle}</Typography>
            </Box>
            <Box sx={{ gridColumn: { xs: 2, sm: 3 }, gridRow: { xs: '1 / span 2', sm: 1 } }}>
              <Acceso destino={alerta.destino} etiqueta={`Ver ${alerta.referencia} en su módulo`}>Ver</Acceso>
            </Box>
          </Box>
        ))}
      </Box>
      {alertas.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No hay pendientes de atención.</Typography>}
      {alertas.length > resumenPendientes && (
        <Button
          color="inherit"
          aria-expanded={mostrarTodo}
          aria-controls="pendientes-lista"
          onClick={() => setMostrarTodo(!mostrarTodo)}
          sx={{ mt: 0.5 }}
        >
          {mostrarTodo ? 'Mostrar menos' : 'Ver todos los pendientes'}
        </Button>
      )}
    </Paper>
  );
}

function Entregas() {
  const maximo = Math.max(0, ...entregas.map((dia) => dia.cantidad));
  const paso = Math.max(1, Math.ceil((maximo + 1) / 3));
  const marcas = [3, 2, 1, 0].map((indice) => indice * paso);
  return (
    <Paper component="section" variant="outlined" aria-labelledby="entregas-titulo" sx={panel}>
      <Typography id="entregas-titulo" component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>Próximas entregas</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Pedidos abiertos · próximos 7 días</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '2ch minmax(0, 1fr)', columnGap: 1, mt: 2 }}>
        <Stack aria-hidden="true" sx={{ justifyContent: 'space-between', height: 146, textAlign: 'right', color: 'text.secondary', fontSize: 12, lineHeight: 1 }}>
          {marcas.map((marca) => <span key={marca}>{marca}</span>)}
        </Stack>
        <Box sx={{ position: 'relative' }}>
          <Stack aria-hidden="true" sx={{ justifyContent: 'space-between', position: 'absolute', inset: '5px 0 auto', height: 136 }}>
            {marcas.map((marca) => <Box key={marca} sx={{ borderTop: '1px solid', borderColor: 'divider' }} />)}
          </Stack>
          <Box component="ol" aria-label="Cantidad de pedidos por día" sx={{ position: 'relative', m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
            {entregas.map((dia, indice) => (
              <Box component="li" key={dia.fecha} title={fechaVisible(dia.fecha)} sx={{ textAlign: 'center', minWidth: 0 }}>
                <Stack sx={{ alignItems: 'center', justifyContent: 'flex-end', height: 141 }}>
                  <Typography component="span" variant="caption" color={dia.cantidad ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: dia.cantidad ? 700 : 400 }}>{dia.cantidad}</Typography>
                  <Box aria-hidden="true" sx={{
                    height: `${dia.cantidad / marcas[0] * 136}px`, width: '48%', maxWidth: 30,
                    bgcolor: indice === 0 ? 'primary.main' : 'text.secondary', borderRadius: '3px 3px 0 0',
                  }} />
                </Stack>
                <Typography component="time" dateTime={dia.fecha} variant="caption" sx={{ display: 'block', mt: 0.75, fontWeight: indice === 0 ? 700 : 400 }}>{dia.etiqueta}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {!maximo && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No hay entregas previstas.</Typography>}
      <Box sx={{ mt: 1 }}><Acceso destino="pedidos">Ir a Pedidos</Acceso></Box>
    </Paper>
  );
}

function Cobros() {
  const [mes, setMes] = useState(mesesCobros[0].valor);
  const cobros = cobrosPorTipo(mes);
  const total = cobros.reduce((suma, cobro) => suma + cobro.centavos, 0);
  const porciones = [];
  let inicio = 0;
  for (const [indice, cobro] of cobros.entries()) {
    const proporcion = cobro.centavos / total;
    porciones.push({ ...cobro, proporcion, inicio, color: coloresCobros[indice % coloresCobros.length] });
    inicio += proporcion;
  }
  return (
    <Paper component="section" variant="outlined" aria-labelledby="cobros-titulo" sx={panel}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
        <Typography id="cobros-titulo" component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>Cobros por tipo de pedido</Typography>
        <TextField select label="Mes de cobro" size="small" value={mes} onChange={(evento) => setMes(evento.target.value)} sx={{ minWidth: 160 }}>
          {mesesCobros.map((opcion) => <MenuItem key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</MenuItem>)}
        </TextField>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 1.5, alignItems: 'center' }} aria-live="polite">
        <Box sx={{ display: 'grid', placeItems: 'center', position: 'relative', width: 156, height: 156, flexShrink: 0 }}>
          <Box component="svg" viewBox="0 0 156 156" aria-hidden="true" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <Box component="circle" cx="78" cy="78" r="70" fill="none" stroke="currentColor" strokeWidth="10" sx={{ color: 'divider' }} />
            {porciones.map((porcion) => (
              <Box component="circle" key={porcion.tipo} cx="78" cy="78" r="70" fill="none" stroke="currentColor" strokeWidth="10"
                pathLength="100" transform="rotate(-90 78 78)"
                strokeDasharray={`${porcion.proporcion * 100} 100`} strokeDashoffset={-porcion.inicio * 100}
                sx={{ color: porcion.color }}>
                <title>{`${porcion.tipo} · ${moneda.format(porcion.centavos / 100)}`}</title>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: 'center', maxWidth: 128 }}>
            <Typography variant="caption" color="text.secondary">Total cobrado</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{moneda.format(total / 100)}</Typography>
          </Box>
        </Box>
        {total ? (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, width: '100%', minWidth: 0 }}>
            {porciones.map((porcion) => (
              <Stack component="li" key={porcion.tipo} direction="row"
                sx={{ py: 0.75, justifyContent: 'space-between', alignItems: 'baseline', gap: 1, '& + &': { borderTop: '1px solid', borderColor: 'divider' } }}>
                <Stack direction="row" sx={{ alignItems: 'baseline', gap: 0.75 }}>
                  <Box aria-hidden="true" sx={{ width: 8, height: 8, flexShrink: 0, borderRadius: '50%', bgcolor: porcion.color }} />
                  <Typography variant="body2">{porcion.tipo}</Typography>
                </Stack>
                <Box sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{moneda.format(porcion.centavos / 100)}</Typography>
                  <Typography variant="caption" color="text.secondary">{porcentaje.format(porcion.proporcion)}</Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        ) : <Typography variant="body2" color="text.secondary">Sin cobros en este período.</Typography>}
      </Stack>
      <Acceso destino="comprobantes_pago">Ir a Comprobantes de Pago</Acceso>
    </Paper>
  );
}

export default function DashboardScreen() {
  return (
    <Stack spacing={2} sx={{ px: { xs: 0.5, sm: 0 }, fontVariantNumeric: 'tabular-nums' }}>
      <Box component="header">
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>Inicio</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Datos de demostración · <time dateTime={FECHA_DEMO}>{fechaVisible(FECHA_DEMO)}</time>
        </Typography>
      </Box>

      <Paper component="dl" aria-label="Indicadores operativos" variant="outlined" sx={{
        ...panel, m: 0, p: 0, display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        '& > div': { p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: 'divider' },
        '& > div:nth-of-type(even), & > div:nth-of-type(3)': { borderLeftStyle: 'solid', borderLeftColor: 'divider' },
        '& > div:nth-of-type(even)': { borderLeftWidth: 1 },
        '& > div:nth-of-type(3)': { borderLeftWidth: { xs: 0, md: 1 } },
        '& > div:nth-of-type(n+3)': { borderTopWidth: { xs: 1, md: 0 }, borderTopStyle: 'solid', borderTopColor: 'divider' },
      }}>
        {categorias.map((categoria) => (
          <Box key={categoria.destino}>
            <Typography component="dt" variant="body2" color="text.secondary">{categoria.titulo}</Typography>
            <Typography component="dd" sx={{ m: 0, mt: 0.25, fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>
              {alertas.filter((alerta) => alerta.destino === categoria.destino).length}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Pendientes />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' } }}>
        <Entregas />
        <Cobros />
      </Box>
    </Stack>
  );
}
