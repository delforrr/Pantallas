import PropTypes from 'prop-types';
import { Box, Paper, Typography, Grid } from '@mui/material';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';

/**
 * Componente Wrapper de Comprobante / Documento Comercial (Ventas ERP)
 * Réplica estructurada estilo formulario físico (Bimbo / Comprobante Oficial ERP)
 * Conserva todos los inputs, atributos originales y reactividad.
 */
export const ComprobanteDocumentWrapper = ({
  tipoDocTitle = 'Pedido',
  nroDocumento = 'PED-2026-001',
  empresaNombre = 'PASTAFAB S.A.',
  empresaDireccion = 'Av. San Martín 1045',
  empresaEmail = 'ventas@pastafab.com.ar',
  empresaTelefono = 'Tel: (02392) 43-9901',
  empresaUbicacion = 'Trenque Lauquen - Argentina',
  headerGrid = null,
  itemsTitle = 'Por favor suministrar lo siguiente',
  itemsTable = null,
  footerGrid = null,
  observacionesInput = null,
  totalLabel = 'Valor total del pedido:',
  totalAmount = 0,
  extraTotals = null,
}) => {
  const borderColor = (theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : '#222222';
  const tableHeaderBg = (theme) =>
    theme.palette.mode === 'dark' ? 'rgba(0, 146, 70, 0.25)' : '#f0f4f1';

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 1.5, sm: 3 },
        borderRadius: '12px',
        border: '2px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'primary.main' : '#222222'),
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff'),
        color: 'text.primary',
        maxWidth: '920px',
        mx: 'auto',
        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.12)',
      }}
    >
      {/* 1. SECCIÓN ENCABEZADO: LOGO + DATOS EMPRESA | CUADRO TIPO COMPROBANTE & NRO */}
      <Grid container spacing={2} alignItems="stretch" sx={{ mb: 2 }}>
        {/* Lado Izquierdo: Branding PastaFab */}
        <Grid item xs={12} sm={7} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '10px',
                bgcolor: '#009246',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justify: 'center',
                p: 0.5,
                boxShadow: '0 4px 10px rgba(0,146,70,0.3)',
              }}
            >
              <DinnerDiningIcon sx={{ fontSize: 36 }} />
              <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.65rem', lineHeight: 1 }}>
                PASTAFAB
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '0.5px', lineHeight: 1.2 }}>
                {empresaNombre}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 500 }}>
                {empresaDireccion} • {empresaEmail}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 500 }}>
                {empresaTelefono} • {empresaUbicacion}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Lado Derecho: Cuadro Estructurado de Tipo & Número de Comprobante */}
        <Grid item xs={12} sm={5} md={4}>
          <Box
            sx={{
              border: (theme) => `2px solid ${borderColor(theme)}`,
              borderRadius: '6px',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                bgcolor: tableHeaderBg,
                borderBottom: (theme) => `2px solid ${borderColor(theme)}`,
                py: 0.75,
                px: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: 'text.primary' }}>
                {tipoDocTitle}
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1.5,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fafafa'),
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.5px' }}>
                No. {nroDocumento}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* 2. SECCIÓN GRILLA DE DATOS PRINCIPALES (Cliente, Dirección, Teléfono, Fecha, etc.) */}
      {headerGrid && (
        <Box
          sx={{
            border: (theme) => `1.5px solid ${borderColor(theme)}`,
            borderRadius: '6px',
            overflow: 'hidden',
            mb: 2.5,
          }}
        >
          {headerGrid}
        </Box>
      )}

      {/* 3. SECCIÓN ENCABEZADO DE ÍTEMS: "Por favor suministrar lo siguiente" */}
      <Box
        sx={{
          textAlign: 'center',
          py: 0.75,
          mb: 1.5,
          borderTop: (theme) => `1.5px solid ${borderColor(theme)}`,
          borderBottom: (theme) => `1.5px solid ${borderColor(theme)}`,
          bgcolor: tableHeaderBg,
          borderRadius: '4px',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontStyle: 'italic', letterSpacing: '0.5px', color: 'text.primary' }}>
          {itemsTitle}
        </Typography>
      </Box>

      {/* 4. SECCIÓN TABLA DE ÍTEMS / PRODUCTOS SOLICITADOS */}
      {itemsTable && <Box sx={{ mb: 2.5 }}>{itemsTable}</Box>}

      {/* 5. SECCIÓN PIE DE DOCUMENTO (Fechas, Vendedor, Forma de Pago, Observaciones y Cuadro Total) */}
      <Box
        sx={{
          border: (theme) => `1.5px solid ${borderColor(theme)}`,
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={0}>
          {/* Bloque Izquierdo: Campos de Pie + Observaciones */}
          <Grid item xs={12} md={8} sx={{ borderRight: { md: (theme) => `1.5px solid ${borderColor(theme)}` } }}>
            {footerGrid}
            {observacionesInput && (
              <Box sx={{ p: 1.5, borderTop: (theme) => `1px solid ${borderColor(theme)}` }}>
                {observacionesInput}
              </Box>
            )}
          </Grid>

          {/* Bloque Derecho: Totales y Monto Final */}
          <Grid item xs={12} md={4} sx={{ bgcolor: tableHeaderBg, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
            {extraTotals}
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 0.5 }}>
              {totalLabel}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: 'primary.main',
                lineHeight: 1.1,
                wordBreak: 'break-word',
              }}
            >
              $ {Number(totalAmount || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

ComprobanteDocumentWrapper.propTypes = {
  tipoDocTitle: PropTypes.string,
  nroDocumento: PropTypes.string,
  empresaNombre: PropTypes.string,
  empresaDireccion: PropTypes.string,
  empresaEmail: PropTypes.string,
  empresaTelefono: PropTypes.string,
  empresaUbicacion: PropTypes.string,
  headerGrid: PropTypes.node,
  itemsTitle: PropTypes.string,
  itemsTable: PropTypes.node,
  footerGrid: PropTypes.node,
  observacionesInput: PropTypes.node,
  totalLabel: PropTypes.string,
  totalAmount: PropTypes.number,
  extraTotals: PropTypes.node,
};

export default ComprobanteDocumentWrapper;
