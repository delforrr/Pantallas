import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Paper, Stack, Typography } from '@mui/material';
import { StatusChip, RecordIcon } from './ModuleUI';
export const MaquinariaCard = ({
  maquinaria,
  onEdit,
  onDelete,
  onNewOrder,
  onViewDetail
}) => {
  if (!maquinaria) return null;
  return <Paper variant="outlined" sx={{
    p: 2,
    borderRadius: '14px',
    height: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column'
  }}>
    <Typography variant="caption" color="text.secondary">{maquinaria.codigo}</Typography>
    <Typography component="h3" variant="subtitle1" sx={{
      ...{
        overflowWrap: 'anywhere',
        mb: 1
      },
      fontWeight: 700
    }}>{maquinaria.nombre}</Typography>
    <Stack sx={{
      alignItems: "flex-start",
      gap: 1,
      mb: 2
    }}><StatusChip value={maquinaria.estado} /><Typography variant="body2">Horas de operación: {maquinaria.horasUso} h</Typography></Stack>
    <Stack direction="row" sx={{
      gap: 1,
      flexWrap: "wrap",
      mt: "auto"
    }}><RecordIcon label="Crear orden" color="primary" onClick={() => onNewOrder(maquinaria)}><AddIcon /></RecordIcon><RecordIcon label="Ver detalle" onClick={() => onViewDetail(maquinaria)}><VisibilityOutlinedIcon /></RecordIcon><RecordIcon label="Editar" color="primary" onClick={() => onEdit(maquinaria)}><EditOutlinedIcon /></RecordIcon><RecordIcon label="Eliminar" color="error" onClick={() => onDelete(maquinaria)}><DeleteOutlineIcon /></RecordIcon></Stack>
  </Paper>;
};
export default MaquinariaCard;
