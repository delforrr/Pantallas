import { Box, Divider, Paper, Typography } from '@mui/material';
import { StatusChip } from './ModuleUI';

export default function OrdenMantenimientoDetalle({ orden }) {
  const fields = [ ['Equipo', `${orden.maquinariaCodigo} · ${orden.maquinariaNombre}`], ['Técnico responsable', orden.tecnicoNombre], ['Tipo de mantenimiento', orden.tipo], ['Fecha de emisión', orden.fechaEmision], ['Inicio', orden.fechaInicio || 'Pendiente'], ['Finalización', orden.fechaFin || 'Pendiente'] ];
  return <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', borderBottom: '2px solid', borderColor: 'primary.main' }}><Box><Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>PastaFab</Typography><Typography variant="body2" color="text.secondary">Servicio técnico y mantenimiento</Typography></Box><Box><Typography variant="subtitle2" sx={{ textTransform: 'uppercase', fontWeight: 800 }}>Orden de mantenimiento</Typography><Typography sx={{ fontFamily: 'monospace', mb: 1 }}>Nº {orden.id}</Typography><StatusChip value={orden.estado} /></Box></Box>
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>{fields.map(([label,value])=><Box key={label}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography></Box>)}</Box><Divider />
    <Box sx={{ p: { xs: 2, sm: 3 } }}><Typography variant="subtitle2" sx={{ mb: 1 }}>Trabajo previsto / fallo observado</Typography><Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{orden.descripcion || orden.tareaRealizada}</Typography></Box>
    {orden.tareaRealizada && <><Divider /><Box sx={{ p: { xs: 2, sm: 3 } }}><Typography variant="subtitle2" sx={{ mb: 1 }}>Informe de intervención</Typography><Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{orden.tareaRealizada}</Typography>{orden.estadoMaquina && <Typography variant="body2" sx={{ mt: 2, fontWeight: 700 }}>Estado resultante del equipo: {orden.estadoMaquina}</Typography>}</Box></>}
  </Paper>;
}
