import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { receivedStockDetails } from '../../pages/compras/logic';

export default function StockRecibido({ stock, remitos, onViewReceipt }) {
  const rows = receivedStockDetails(stock, remitos);
  return <Accordion variant="outlined" disableGutters sx={{ mt: 2, borderRadius: '14px', backgroundImage: 'none', '&:before': { display: 'none' } }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Stock recibido</Typography></AccordionSummary>
    <AccordionDetails sx={{ p: { xs: 1.5, sm: 2 } }}>
      {!rows.length ? <Typography variant="body2" color="text.secondary">Todavía no hay recepciones registradas.</Typography> : <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
        {rows.map(row => <Box component="li" key={`${row.materiaPrima}|${row.unidad}`} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 0 }}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 650, minWidth: 0 }}>{row.materiaPrima}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 750, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{row.cantidad.toLocaleString('es-AR')} {row.unidad}</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">Remitos asociados</Typography>
          <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 0.5, gap: 1 }}>
            {row.recepciones.map(({ remito, cantidad }) => <Stack component="li" key={remito.id} direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<ReceiptLongOutlinedIcon />} onClick={() => onViewReceipt(remito)} aria-label={`Ver remito ${remito.id}`} sx={{ minWidth: 0, overflowWrap: 'anywhere', textAlign: 'left' }}>{remito.id}</Button>
              <Box sx={{ textAlign: { sm: 'right' }, flexShrink: 0 }}><Typography variant="body2">{cantidad.toLocaleString('es-AR')} {row.unidad}</Typography><Typography variant="caption" color="text.secondary">{remito.fechaEntregaReal}</Typography></Box>
            </Stack>)}
            {!row.recepciones.length && <Typography component="li" variant="body2" color="text.secondary">Sin cantidades aceptadas.</Typography>}
          </Stack>
        </Box>)}
      </Box>}
    </AccordionDetails>
  </Accordion>;
}
