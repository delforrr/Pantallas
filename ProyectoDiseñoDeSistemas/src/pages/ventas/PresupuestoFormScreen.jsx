import { Box, TextField } from '@mui/material';
import { CamposDocumento, ClienteDocumento, FormularioDocumento, ImporteDocumento, ProductosDocumento } from '../../components/ventas/DocumentoFormUI';

export default function PresupuestoFormScreen({ datos, clientes, onCreateCliente, onChange, onCancel, onSubmit, isEditing, subtotal, descuento, total, error }) {
  const cliente = clientes.find(c => c.idCliente === datos.idCliente);
  const cambiar = cambios => onChange({ ...datos, ...cambios });
  return <FormularioDocumento title={isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto'} maxWidth={1000}
    onCancel={onCancel} onSave={onSubmit} action={isEditing ? 'Guardar cambios' : 'Guardar presupuesto'} canSave={Boolean(cliente && datos.items.length)} error={error}>
    <CamposDocumento columns={3}>
      <Box sx={{ gridColumn: 'span 2' }}>
        <ClienteDocumento clientes={clientes} value={datos.idCliente} onCreate={onCreateCliente} onChange={c => cambiar({ idCliente: c?.idCliente ?? '' })} />
      </Box>
      <TextField label="Válido hasta" type="date" required size="small" disabled={!cliente} value={datos.validezHasta} onChange={event => cambiar({ validezHasta: event.target.value })} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: datos.fechaEmision } }} />
    </CamposDocumento>
    <ProductosDocumento items={datos.items} onChange={items => cambiar({ items })} disabled={!cliente} minimo={10} />
    <CamposDocumento columns={5}>
      <Box sx={{ gridColumn: 'span 2' }}><TextField fullWidth label="Observaciones" size="small" disabled={!cliente} value={datos.observaciones || ''} onChange={event => cambiar({ observaciones: event.target.value })} /></Box>
      <ImporteDocumento label="Subtotal" amount={subtotal} />
      <ImporteDocumento label={`Mayorista (${descuento}%)`} amount={-subtotal * descuento / 100} />
      <ImporteDocumento label="Total" amount={total} primary />
    </CamposDocumento>
  </FormularioDocumento>;
}
