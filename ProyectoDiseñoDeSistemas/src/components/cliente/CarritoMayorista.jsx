import { Box, Paper, Typography, Button, IconButton, Alert, TextField, MenuItem, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useApp } from '../../context/AppContext';
import { useClientStore, clientStore, MINIMO_MAYORISTA, DIAS_ENTREGA_SEMANAL, CATALOGO_CLIENTE, calcularPresupuestoMayorista } from '../../pages/cliente/mockData';
import { ResumenImportesMayorista } from './PresupuestoMayorista';

export default function CarritoMayorista() {
  const { mayoristaItems, mayoristaEntrega } = useClientStore();
  const { navigate } = useApp();
  const presupuesto = {
    ...calcularPresupuestoMayorista(mayoristaItems),
    tipoMayorista: mayoristaEntrega.tipo,
    diaEntregaSemanal: mayoristaEntrega.tipo === 'semanal' ? mayoristaEntrega.dia : undefined,
  };

  const totalUnidades = presupuesto.items.reduce((acc, item) => acc + item.cantidad, 0);
  const minimoRequerido = MINIMO_MAYORISTA; // 10 unidades
  const cumpleMinimo = totalUnidades >= minimoRequerido && presupuesto.valido;
  const tipoLabel = mayoristaEntrega.tipo === 'semanal' ? 'Pedido Semanal' : 'Pedido de Eventos';
  const entregaValida = mayoristaEntrega.tipo === 'evento' || DIAS_ENTREGA_SEMANAL.includes(mayoristaEntrega.dia);
  const volverAProductos = () => {
    clientStore.setCatalogoModo('mayorista');
    navigate('catalogo');
  };

  const estaVacio = presupuesto.items.length === 0;

  return (
    <Paper component="section" sx={{ p: { xs: 2, md: 3 }, borderRadius: '14px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Tu Carrito Mayorista
        </Typography>
        {!estaVacio && (
          <Chip
            label={`Total: ${totalUnidades} ${totalUnidades === 1 ? 'unidad' : 'unidades'}`}
            color={cumpleMinimo ? 'success' : 'default'}
            sx={{ fontWeight: 700 }}
          />
        )}
      </Box>

      {estaVacio ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2.5, fontWeight: 600 }}>
            No hay productos en el carrito
          </Typography>
          <Button variant="contained" color="primary" onClick={volverAProductos} sx={{ fontWeight: 700, px: 3, py: 1 }}>
            Ir al Catálogo Mayorista
          </Button>
        </Box>
      ) : (
        <>
          {/* Selector de Tipo de Pedido Mayorista */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: mayoristaEntrega.tipo === 'semanal' ? '1fr 1fr' : '1fr' }, gap: 2, mb: 2.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Tipo de pedido mayorista"
              value={mayoristaEntrega.tipo}
              onChange={(event) => clientStore.setWholesaleDelivery({ tipo: event.target.value })}
            >
              <MenuItem value="evento">Para un evento (Mínimo 10 unidades)</MenuItem>
              <MenuItem value="semanal">Pedido semanal (Mínimo 10 unidades · 10% desc.)</MenuItem>
            </TextField>
            {mayoristaEntrega.tipo === 'semanal' && (
              <TextField
                select
                required
                fullWidth
                size="small"
                label="Día de entrega semanal"
                value={mayoristaEntrega.dia}
                onChange={(event) => clientStore.setWholesaleDelivery({ ...mayoristaEntrega, dia: event.target.value })}
                helperText="Elegí el día en que querés recibir la mercadería cada semana."
              >
                {DIAS_ENTREGA_SEMANAL.map((dia) => (
                  <MenuItem key={dia} value={dia}>{dia}</MenuItem>
                ))}
              </TextField>
            )}
          </Box>

          {/* Validación dinámica de Cantidad Mínima solo si faltan unidades */}
          {!cumpleMinimo && (
            <Alert
              severity="warning"
              icon={<WarningAmberIcon />}
              sx={{ mb: 3, borderRadius: '10px', border: '1px solid', borderColor: 'warning.main' }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Cantidad mínima no alcanzada para {tipoLabel}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.84rem' }}>
                La cantidad seleccionada ({totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'}) <strong>no te permite realizar el {tipoLabel}</strong>. La cantidad mínima requerida es de <strong>{minimoRequerido} unidades</strong> (te faltan {minimoRequerido - totalUnidades} unidades). Agregá productos desde el catálogo mayorista para alcanzar el mínimo y enviar la cotización.
              </Typography>
            </Alert>
          )}

          {presupuesto.items.map((item) => (
            <Box key={item.idProducto} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ flex: '1 1 240px' }}>
                <Typography sx={{ fontWeight: 700 }}>{item.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${item.precioUnitario.toLocaleString('es-AR')} por {item.unidad} · Mínimo {MINIMO_MAYORISTA}
                </Typography>
              </Box>
              <Box role="group" aria-label={`Cantidad de ${item.nombre}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  aria-label={`Reducir cantidad de ${item.nombre}`}
                  disabled={item.cantidad <= MINIMO_MAYORISTA}
                  onClick={() => clientStore.setWholesaleQuantity(item.idProducto, item.cantidad - 1)}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.cantidad}</Typography>
                <IconButton
                  aria-label={`Aumentar cantidad de ${item.nombre}`}
                  disabled={item.cantidad >= CATALOGO_CLIENTE.find((p) => p.idProducto === item.idProducto).stock}
                  onClick={() => clientStore.setWholesaleQuantity(item.idProducto, item.cantidad + 1)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography sx={{ fontWeight: 700 }}>${item.subtotal.toLocaleString('es-AR')}</Typography>
              <Button color="secondary" onClick={() => clientStore.setWholesaleQuantity(item.idProducto, 0)} aria-label={`Quitar ${item.nombre} del carrito mayorista`}>
                Quitar
              </Button>
            </Box>
          ))}

          <ResumenImportesMayorista pedido={presupuesto} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 3 }}>
            <Button variant="outlined" onClick={volverAProductos}>
              Seguir eligiendo productos
            </Button>
            <Box sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                color="secondary"
                disabled={!cumpleMinimo || !entregaValida}
                onClick={() => {
                  if (clientStore.createWholesaleOrder()) navigate('pedidos_cliente');
                }}
                sx={{ fontWeight: 700, px: 3, py: 1 }}
              >
                Enviar pedido a la tienda
              </Button>
              {!cumpleMinimo && (
                <Typography variant="caption" sx={{ display: 'block', color: 'warning.dark', mt: 0.5, fontWeight: 600 }}>
                  Mínimo para {tipoLabel}: 10 unidades (tenés {totalUnidades})
                </Typography>
              )}
              {cumpleMinimo && mayoristaEntrega.tipo === 'semanal' && !DIAS_ENTREGA_SEMANAL.includes(mayoristaEntrega.dia) && (
                <Typography variant="caption" sx={{ display: 'block', color: 'warning.dark', mt: 0.5, fontWeight: 600 }}>
                  Elegí un día de entrega para enviar el pedido semanal
                </Typography>
              )}
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
}
