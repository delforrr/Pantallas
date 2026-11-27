import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, darken, lighten } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useApp } from "../../context/AppContext";
import {
  alertas,
  cobrosPorTipo,
  entregasPorSemana,
  FECHA_DEMO,
  fechaVisible,
  mesesCobros,
  moneda,
  porcentaje,
  semanasEntrega,
} from "./dashboardData";

const panel = {
  borderRadius: "12px",
  bgcolor: "background.paper",
  backgroundImage: "none",
  borderColor: "divider",
  p: { xs: 2, sm: 2.5 },
};
const panelExpandido = {
  ...panel,
  flex: "1 0 auto",
  display: "flex",
  flexDirection: "column",
};

const coloresCobros = {
  Eventos: "primary.main",
  Mostrador: "text.secondary",
  "Mayorista semanal": "info.main",
  Canjes: "warning.main",
  Donaciones: "text.primary",
};
const secciones = [
  { id: "indicadores", titulo: "Resumen" },
  { id: "pendientes", titulo: "Pendientes" },
  { id: "entregas", titulo: "Entregas" },
  { id: "cobros", titulo: "Cobros" },
];

const indicadores = [
  {
    destino: "pedidos",
    titulo: "Pedidos vencidos o para hoy",
    modulo: "Pedidos",
    tono: "info",
    Icono: LocalShippingOutlinedIcon,
  },
  {
    destino: "materia_prima",
    titulo: "Materias primas en alerta",
    modulo: "Materia Prima",
    tono: "warning",
    Icono: GrassOutlinedIcon,
  },
  {
    destino: "orden_compra",
    titulo: "Recepciones atrasadas",
    modulo: "Órdenes de Compra",
    tono: "primary",
    Icono: Inventory2OutlinedIcon,
  },
  {
    destino: "maquinaria",
    titulo: "Equipos fuera de servicio",
    modulo: "Maquinaria",
    tono: "secondary",
    Icono: BuildCircleOutlinedIcon,
  },
];

function Indicadores() {
  const { navigate } = useApp();
  return (
    <Box
      component="section"
      aria-label="Indicadores operativos"
      sx={{
        flex: "1 0 auto",
        display: "grid",
        gap: { xs: 1, sm: 2 },
        gridAutoRows: "minmax(min-content, 1fr)",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        },
        "@media (min-width: 700px) and (max-height: 579px)": {
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        },
      }}
    >
      {indicadores.map(({ destino, titulo, modulo, tono, Icono }) => (
        <Paper
          key={destino}
          component="a"
          href={`/admin#${destino}`}
          variant="outlined"
          onClick={(evento) => {
            if (
              evento.metaKey ||
              evento.ctrlKey ||
              evento.altKey ||
              evento.shiftKey
            )
              return;
            evento.preventDefault();
            navigate(destino);
          }}
          sx={(theme) => {
            const color = theme.palette[tono].main;
            const oscuro = theme.palette.mode === "dark";
            return {
              ...panel,
              "--indicador-acento": oscuro
                ? lighten(color, 0.36)
                : darken(color, 0.42),
              bgcolor: alpha(color, oscuro ? 0.1 : 0.055),
              borderColor: alpha(color, oscuro ? 0.38 : 0.25),
              borderTopColor: color,
              borderTopWidth: 2,
              p: { xs: 1.5, sm: 2 },
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.75,
              textDecoration: "none",
              "&:hover": { bgcolor: alpha(color, oscuro ? 0.18 : 0.1) },
              "&:focus-visible": {
                outline: "2px solid var(--indicador-acento)",
                outlineOffset: 2,
              },
            };
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              color: "var(--indicador-acento)",
            }}
          >
            <Icono sx={{ fontSize: 24 }} />
            <Typography
              component="span"
              sx={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}
            >
              {alertas.filter((alerta) => alerta.destino === destino).length}
            </Typography>
          </Box>
          <Typography
            component="span"
            variant="body2"
            sx={{ my: "auto", fontWeight: 650 }}
          >
            {titulo}
          </Typography>
          <Typography
            component="span"
            variant="caption"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              color: "var(--indicador-acento)",
              fontWeight: 600,
              ".MuiPaper-root:hover &": { textDecoration: "underline" },
            }}
          >
            {modulo}
            <ArrowForwardIcon sx={{ fontSize: 14, flexShrink: 0 }} />
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

function Acceso({ destino, children, etiqueta }) {
  const { navigate } = useApp();
  return (
    <Button
      color="inherit"
      endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
      onClick={() => navigate(destino)}
      aria-label={etiqueta}
      sx={{
        alignSelf: "flex-start",
        whiteSpace: "nowrap",
        "&.Mui-focusVisible": {
          outline: "2px solid",
          outlineColor: "primary.main",
        },
      }}
    >
      {children}
    </Button>
  );
}

function Pendientes({ filasPorPagina }) {
  const [pagina, setPagina] = useState(0);
  const paginas = Math.ceil(alertas.length / filasPorPagina);
  const paginaVisible = Math.min(pagina, Math.max(0, paginas - 1));
  const inicio = paginaVisible * filasPorPagina;
  const visibles = alertas.slice(inicio, inicio + filasPorPagina);
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby="pendientes-titulo"
      sx={panelExpandido}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "baseline", justifyContent: "space-between", gap: 1 }}
      >
        <Typography
          id="pendientes-titulo"
          component="h2"
          sx={{ fontSize: 18, fontWeight: 700 }}
        >
          Pendientes de hoy
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {alertas.length} {alertas.length === 1 ? "alerta" : "alertas"}
        </Typography>
      </Stack>
      <Box
        component="ul"
        id="pendientes-lista"
        sx={{
          p: 0,
          m: 0,
          mt: 1,
          flex: "1 0 auto",
          listStyle: "none",
        }}
      >
        {visibles.map((alerta) => (
          <Box
            component="li"
            key={alerta.referencia}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr) auto",
                sm: "minmax(0, 1fr) minmax(0, 0.9fr) auto",
              },
              alignItems: "center",
              columnGap: { xs: 1, sm: 3 },
              rowGap: 0.25,
              py: { xs: 1.25, sm: 0.5 },
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {alerta.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {alerta.referencia}
              </Typography>
            </Box>
            <Box
              sx={{
                gridColumn: { xs: 1, sm: 2 },
                gridRow: { xs: 2, sm: 1 },
                minWidth: 0,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color:
                    alerta.prioridad === 0
                      ? (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.error.light
                            : theme.palette.error.dark
                      : "text.primary",
                }}
              >
                {alerta.estado}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {alerta.detalle}
              </Typography>
            </Box>
            <Box
              sx={{
                gridColumn: { xs: 2, sm: 3 },
                gridRow: { xs: "1 / span 2", sm: 1 },
              }}
            >
              <Acceso
                destino={alerta.destino}
                etiqueta={`Ver ${alerta.referencia} en su módulo`}
              >
                Ver
              </Acceso>
            </Box>
          </Box>
        ))}
      </Box>
      {alertas.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No hay pendientes de atención.
        </Typography>
      )}
      {paginas > 1 && (
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 0.5,
            mt: 0.5,
          }}
        >
          <Button
            color="inherit"
            aria-controls="pendientes-lista"
            disabled={paginaVisible === 0}
            onClick={() => setPagina(paginaVisible - 1)}
          >
            Anterior
          </Button>
          <Typography
            variant="caption"
            color="text.secondary"
            aria-live="polite"
          >
            {inicio + 1}–{inicio + visibles.length} de {alertas.length}
          </Typography>
          <Button
            color="inherit"
            aria-controls="pendientes-lista"
            disabled={paginaVisible === paginas - 1}
            onClick={() => setPagina(paginaVisible + 1)}
          >
            Siguiente
          </Button>
        </Stack>
      )}
    </Paper>
  );
}

function Entregas({ compactarGrafico }) {
  const [semana, setSemana] = useState(semanasEntrega[0].valor);
  const entregas = entregasPorSemana(semana);
  const total = entregas.reduce((suma, dia) => suma + dia.cantidad, 0);
  const maximo = Math.max(
    0,
    ...semanasEntrega.flatMap(({ valor }) =>
      entregasPorSemana(valor).map((dia) => dia.cantidad),
    ),
  );
  const paso = Math.ceil((maximo + 1) / 3);
  const marcas = [3, 2, 1, 0].map((indice) => indice * paso);
  const altura = compactarGrafico ? 84 : 136;
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby="entregas-titulo"
      sx={{ ...panelExpandido, ...(compactarGrafico && { p: 1.5 }) }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 0.5,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            id="entregas-titulo"
            component="h2"
            sx={{ fontSize: 18, fontWeight: 700 }}
          >
            Próximas entregas
          </Typography>
          <Typography variant="body2" color="text.secondary" aria-live="polite">
            {total} {total === 1 ? "pedido abierto" : "pedidos abiertos"}
          </Typography>
        </Box>
        <TextField
          select
          label="Semana de entrega"
          size="small"
          value={semana}
          onChange={(evento) => setSemana(Number(evento.target.value))}
          sx={{ minWidth: 136 }}
        >
          {semanasEntrega.map(({ valor, etiqueta }) => (
            <MenuItem key={valor} value={valor}>
              {etiqueta}
            </MenuItem>
          ))}
        </TextField>
        <Acceso destino="pedidos">Pedidos</Acceso>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2ch minmax(0, 1fr)",
          columnGap: 1,
          mt: 1.5,
          flex: "1 0 auto",
          minHeight: altura + 32,
          "--etiquetas-eje": "22px",
        }}
      >
        <Stack
          aria-hidden="true"
          sx={{
            justifyContent: "space-between",
            mb: "var(--etiquetas-eje)",
            textAlign: "right",
            color: "text.secondary",
            fontSize: 12,
            lineHeight: 1,
          }}
        >
          {marcas.map((marca) => (
            <span key={marca}>{marca}</span>
          ))}
        </Stack>
        <Box sx={{ position: "relative", display: "flex" }}>
          <Stack
            aria-hidden="true"
            sx={{
              justifyContent: "space-between",
              position: "absolute",
              inset: "5px 0 calc(var(--etiquetas-eje) + 5px)",
            }}
          >
            {marcas.map((marca) => (
              <Box
                key={marca}
                sx={{ borderTop: "1px solid", borderColor: "divider" }}
              />
            ))}
          </Stack>
          <Box
            component="ol"
            aria-label="Cantidad de pedidos por día"
            sx={{
              position: "relative",
              m: 0,
              p: 0,
              flex: 1,
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            }}
          >
            {entregas.map((dia, indice) => (
              <Box
                component="li"
                key={dia.fecha}
                title={fechaVisible(dia.fecha)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  minWidth: 0,
                }}
              >
                <Box sx={{ position: "relative", flex: 1, my: "5px" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      insetInline: 0,
                      mx: "auto",
                      height: `${(dia.cantidad / marcas[0]) * 100}%`,
                      width: "48%",
                      maxWidth: 52,
                      bgcolor: indice === 0 ? "primary.main" : "text.secondary",
                      borderRadius: "3px 3px 0 0",
                    }}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      color={dia.cantidad ? "text.primary" : "text.secondary"}
                      sx={{
                        position: "absolute",
                        bottom: "100%",
                        insetInline: 0,
                        fontWeight: dia.cantidad ? 700 : 400,
                      }}
                    >
                      {dia.cantidad}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  component="time"
                  dateTime={dia.fecha}
                  variant="caption"
                  sx={{
                    height: "var(--etiquetas-eje)",
                    fontWeight: indice === 0 ? 700 : 400,
                  }}
                >
                  {dia.etiqueta}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {!total && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No hay entregas previstas.
        </Typography>
      )}
    </Paper>
  );
}

function Cobros({ compactarGrafico }) {
  const [mes, setMes] = useState(mesesCobros[0].valor);
  const cobros = cobrosPorTipo(mes);
  const total = cobros.reduce((suma, cobro) => suma + cobro.centavos, 0);
  const porciones = [];
  let inicio = 0;
  const diametro = compactarGrafico ? 112 : 132;
  for (const cobro of cobros) {
    const proporcion = cobro.centavos / total;
    porciones.push({
      ...cobro,
      proporcion,
      inicio,
      color: coloresCobros[cobro.tipo] ?? "action.disabled",
    });
    inicio += proporcion;
  }
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby="cobros-titulo"
      sx={{
        ...panelExpandido,
        ...(compactarGrafico && { p: 1.5 }),
        "@media (min-width: 600px) and (max-height: 579px)": {
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gridTemplateAreas: '"cabecera acceso" "grafico grafico"',
          gridTemplateRows: "auto 1fr",
          columnGap: 0.5,
        },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          gridArea: "cabecera",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography
          id="cobros-titulo"
          component="h2"
          sx={{ fontSize: 18, fontWeight: 700 }}
        >
          Cobros por tipo de pedido
        </Typography>
        <TextField
          select
          label="Mes de cobro"
          size="small"
          value={mes}
          onChange={(evento) => setMes(evento.target.value)}
          sx={{ minWidth: 160 }}
        >
          {mesesCobros.map((opcion) => (
            <MenuItem key={opcion.valor} value={opcion.valor}>
              {opcion.etiqueta}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          gridArea: "grafico",
          my: 1,
          alignItems: "center",
          flex: "1 0 auto",
          minHeight: diametro,
          containerType: "size",
        }}
        aria-live="polite"
      >
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            position: "relative",
            flexShrink: 0,
            aspectRatio: "1",
            width: {
              xs: `clamp(${diametro}px, 100cqh, 40cqw)`,
              sm: `clamp(${diametro}px, 100cqh, min(48cqw, 200px))`,
            },
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 156 156"
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              component="circle"
              cx="78"
              cy="78"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              sx={{ color: "divider" }}
            />
            {porciones.map((porcion) => (
              <Box
                component="circle"
                key={porcion.tipo}
                cx="78"
                cy="78"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                pathLength="100"
                transform="rotate(-90 78 78)"
                strokeDasharray={`${porcion.proporcion * 100} 100`}
                strokeDashoffset={-porcion.inicio * 100}
                sx={{ color: porcion.color }}
              >
                <title>{`${porcion.tipo} · ${moneda.format(porcion.centavos / 100)}`}</title>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: "center", maxWidth: 128 }}>
            <Typography variant="caption" color="text.secondary">
              Total cobrado
            </Typography>
            <Typography
              sx={{ fontSize: compactarGrafico ? 13 : 14, fontWeight: 700 }}
            >
              {moneda.format(total / 100)}
            </Typography>
          </Box>
        </Box>
        {total ? (
          <Box
            component="ul"
            sx={{ listStyle: "none", m: 0, p: 0, width: "100%", minWidth: 0 }}
          >
            {porciones.map((porcion) => (
              <Stack
                component="li"
                key={porcion.tipo}
                direction="row"
                sx={{
                  py: 0.75,
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 1,
                  "& + &": { borderTop: "1px solid", borderColor: "divider" },
                  "@media (max-width: 359px)": {
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: 0,
                  },
                }}
              >
                <Stack
                  direction="row"
                  sx={{ alignItems: "baseline", gap: 0.75 }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 8,
                      height: 8,
                      flexShrink: 0,
                      borderRadius: "50%",
                      bgcolor: porcion.color,
                    }}
                  />
                  <Typography variant="body2">{porcion.tipo}</Typography>
                </Stack>
                <Box
                  sx={{
                    display: { xs: "block", sm: "flex" },
                    alignItems: "baseline",
                    gap: 1,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {moneda.format(porcion.centavos / 100)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: "5ch" }}
                  >
                    {porcentaje.format(porcion.proporcion)}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Sin cobros en este período.
          </Typography>
        )}
      </Stack>
      <Box sx={{ gridArea: "acceso" }}>
        <Acceso destino="comprobantes_pago">Ir a Comprobantes de Pago</Acceso>
      </Box>
    </Paper>
  );
}

export default function DashboardScreen() {
  const tienePestanas = useMediaQuery(
    "(max-width: 1099px), (max-height: 759px)",
  );
  const pocoAlto = useMediaQuery("(max-height: 579px)");
  const cabenDiezAlertas = useMediaQuery(
    "(min-width: 600px) and (min-height: 1000px)",
  );
  const cabenSieteAlertas = useMediaQuery(
    "(min-width: 600px) and (min-height: 850px)",
  );
  const cabenCuatroAlertas = useMediaQuery(
    "(min-width: 600px) and (min-height: 760px)",
  );
  const cabenTresAlertas = useMediaQuery("(min-height: 760px)");
  const filasPorPagina = cabenDiezAlertas
    ? 10
    : cabenSieteAlertas
      ? 7
      : cabenCuatroAlertas
        ? 4
        : cabenTresAlertas
          ? 3
          : pocoAlto
            ? 1
            : 2;
  const [seccion, setSeccion] = useState("indicadores");
  const contenido = {
    indicadores: <Indicadores />,
    pendientes: <Pendientes filasPorPagina={filasPorPagina} />,
    entregas: <Entregas compactarGrafico={!tienePestanas || pocoAlto} />,
    cobros: <Cobros compactarGrafico={!tienePestanas || pocoAlto} />,
  };
  const mostrarPanel = (id) => (
    <Box
      id={`panel-inicio-${id}`}
      role={tienePestanas ? "tabpanel" : undefined}
      aria-labelledby={tienePestanas ? `tab-inicio-${id}` : undefined}
      hidden={tienePestanas && seccion !== id}
      sx={{
        gridArea:
          tienePestanas || id === "indicadores" || id === "pendientes"
            ? id
            : undefined,
        minWidth: 0,
        minHeight: 0,
        overflowY: "auto",
        p: "2px",
        m: "-2px",
        "&:not([hidden])": { display: "flex", flexDirection: "column" },
      }}
    >
      {contenido[id]}
    </Box>
  );

  return (
    <Stack
      sx={{
        height: "100%",
        gap: { xs: 1, sm: 1.5 },
        px: { xs: 0.5, sm: 0 },
        fontVariantNumeric: "tabular-nums",
        "@media (max-height: 579px)": { gap: 0.5 },
      }}
    >
      <Box
        component="header"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          columnGap: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
          Inicio
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          <time dateTime={FECHA_DEMO}>{fechaVisible(FECHA_DEMO)}</time>
        </Typography>
      </Box>

      {tienePestanas && (
        <Tabs
          value={seccion}
          onChange={(_, valor) => setSeccion(valor)}
          variant="fullWidth"
          aria-label="Secciones de Inicio"
          sx={{
            flexShrink: 0,
            borderBottom: "1px solid",
            borderColor: "divider",
            "& .MuiTab-root": { minWidth: 0, px: 0.5 },
          }}
        >
          {secciones.map(({ id, titulo }) => (
            <Tab
              key={id}
              id={`tab-inicio-${id}`}
              aria-controls={`panel-inicio-${id}`}
              value={id}
              label={titulo}
            />
          ))}
        </Tabs>
      )}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: tienePestanas
            ? "minmax(0, 1fr)"
            : "minmax(0, 1.1fr) minmax(0, 1fr)",
          gridTemplateRows: tienePestanas
            ? "minmax(0, 1fr)"
            : "auto minmax(0, 1fr)",
          gridTemplateAreas: tienePestanas
            ? `"${seccion}"`
            : '"indicadores indicadores" "pendientes graficos"',
        }}
      >
        {mostrarPanel("indicadores")}
        {mostrarPanel("pendientes")}
        <Box
          sx={
            tienePestanas
              ? { display: "contents" }
              : {
                  gridArea: "graficos",
                  minHeight: 0,
                  display: "grid",
                  gap: 1.5,
                  gridTemplateRows:
                    "minmax(min-content, 0.95fr) minmax(min-content, 1.05fr)",
                }
          }
        >
          {mostrarPanel("entregas")}
          {mostrarPanel("cobros")}
        </Box>
      </Box>
    </Stack>
  );
}
