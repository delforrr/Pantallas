import { Box, Divider, Paper, Typography } from '@mui/material';
import { StatusChip } from './ModuleUI';
export default function FichaMaquinariaDetalle({ maquinaria }) {
  return <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
    <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '2px solid', borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}><Box><Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>PastaFab</Typography><Typography variant="body2" color="text.secondary">Registro de equipos</Typography></Box><Box><Typography variant="subtitle2" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>Ficha técnica</Typography><Typography sx={{ fontFamily: 'monospace' }}>{maquinaria.codigo}</Typography></Box></Box>
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}><Box sx={{ gridColumn: '1 / -1' }}><Typography variant="caption" color="text.secondary">Descripción del equipo</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{maquinaria.nombre}</Typography></Box><Box><Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Estado operativo</Typography><StatusChip value={maquinaria.estado} /></Box><Box><Typography variant="caption" color="text.secondary">Horas de operación</Typography><Typography>{maquinaria.horasUso} h</Typography></Box></Box><Divider />
    <Box sx={{ p: { xs: 2, sm: 3 } }}><Typography variant="subtitle2" sx={{ mb: 1 }}>Observaciones técnicas</Typography><Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{maquinaria.observaciones || 'Sin observaciones registradas.'}</Typography></Box>
  </Paper>;
}
