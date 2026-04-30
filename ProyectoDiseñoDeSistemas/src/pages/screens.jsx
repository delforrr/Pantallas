import React from 'react';
import { Box, Grid, Typography, Chip, Button, Skeleton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SkeletonCard, SkeletonRow, SectionLabel } from '../components/SkeletonComponents';

// ─── CLIENTE ───────────────────────────────────────────────

export const CatalogoScreen = () => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {['Todos', 'Fideos', 'Rellenos', 'Salsas', 'Especiales'].map((c) => (
        <Chip key={c} label={c} clickable
          sx={{ background: c === 'Todos' ? 'rgba(232,160,32,0.2)' : 'rgba(42,34,16,0.7)',
            color: c === 'Todos' ? '#E8A020' : '#B8A882',
            border: `1px solid ${c === 'Todos' ? 'rgba(232,160,32,0.4)' : 'rgba(232,160,32,0.1)'}` }} />
      ))}
      <Button startIcon={<FilterListIcon />} size="small"
        sx={{ ml: 'auto', color: '#B8A882', border: '1px solid rgba(232,160,32,0.15)', borderRadius: '8px' }}>
        Filtros
      </Button>
    </Box>
    <SectionLabel>Productos destacados</SectionLabel>
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {[220, 200, 210, 190, 215, 200].map((h, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <SkeletonCard height={h} />
        </Grid>
      ))}
    </Grid>
    <SectionLabel>Más vendidos esta semana</SectionLabel>
    <Grid container spacing={2}>
      {[160, 155, 160].map((h, i) => (
        <Grid item xs={12} sm={4} key={i}><SkeletonCard height={h} /></Grid>
      ))}
    </Grid>
  </Box>
);

export const CarritoScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <SectionLabel>Ítems en tu carrito</SectionLabel>
        {[1,2,3].map((i) => (
          <Box key={i} sx={{ background: 'rgba(42,34,16,0.5)', border: '1px solid rgba(232,160,32,0.1)',
            borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Skeleton variant="rounded" width={72} height={72} sx={{ background: 'rgba(232,160,32,0.08)', borderRadius: '10px', flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="55%" height={20} sx={{ background: 'rgba(232,160,32,0.08)' }} />
              <Skeleton width="35%" height={16} sx={{ background: 'rgba(232,160,32,0.06)', mt: 0.5 }} />
            </Box>
            <Skeleton width={80} height={36} sx={{ background: 'rgba(232,160,32,0.08)', borderRadius: '8px' }} />
          </Box>
        ))}
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ background: 'rgba(42,34,16,0.6)', border: '1px solid rgba(232,160,32,0.15)',
          borderRadius: '16px', p: 3 }}>
          <SectionLabel>Resumen del pedido</SectionLabel>
          {['Subtotal','Descuento','Envío','Total'].map((l) => (
            <Box key={l} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Skeleton width={80} height={18} sx={{ background: 'rgba(232,160,32,0.07)' }} />
              <Skeleton width={60} height={18} sx={{ background: 'rgba(232,160,32,0.07)' }} />
            </Box>
          ))}
          <Skeleton variant="rounded" height={44} sx={{ background: 'rgba(232,160,32,0.15)', borderRadius: '10px', mt: 2 }} />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export const PedidosClienteScreen = () => (
  <Box>
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {['Todos','Pendientes','En Producción','Entregados','Cancelados'].map((s) => (
        <Chip key={s} label={s} size="small" clickable
          sx={{ background: 'rgba(42,34,16,0.7)', color: '#B8A882', border: '1px solid rgba(232,160,32,0.1)' }} />
      ))}
    </Box>
    <SectionLabel>Historial de pedidos</SectionLabel>
    {[1,2,3,4].map((i) => (
      <Box key={i} sx={{ background: 'rgba(42,34,16,0.5)', border: '1px solid rgba(232,160,32,0.1)',
        borderRadius: '12px', p: 2.5, mb: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Skeleton variant="circular" width={44} height={44} sx={{ background: 'rgba(232,160,32,0.08)', flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="40%" height={20} sx={{ background: 'rgba(232,160,32,0.08)' }} />
          <Skeleton width="25%" height={15} sx={{ background: 'rgba(232,160,32,0.06)', mt: 0.5 }} />
        </Box>
        <Skeleton width={90} height={28} sx={{ background: 'rgba(39,174,96,0.12)', borderRadius: '8px' }} />
        <Skeleton width={70} height={20} sx={{ background: 'rgba(232,160,32,0.08)' }} />
      </Box>
    ))}
  </Box>
);

export const MediosPagoScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <SectionLabel>Métodos de pago guardados</SectionLabel>
        {[1,2].map((i) => (
          <Box key={i} sx={{ background: 'rgba(42,34,16,0.5)', border: '1px solid rgba(232,160,32,0.1)',
            borderRadius: '14px', p: 2.5, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Skeleton variant="rounded" width={52} height={36} sx={{ background: 'rgba(232,160,32,0.1)', borderRadius: '8px' }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="50%" height={20} sx={{ background: 'rgba(232,160,32,0.08)' }} />
              <Skeleton width="30%" height={15} sx={{ background: 'rgba(232,160,32,0.05)', mt: 0.5 }} />
            </Box>
          </Box>
        ))}
        <Skeleton variant="rounded" height={44} sx={{ background: 'rgba(232,160,32,0.08)', borderRadius: '10px', mt: 1 }} />
      </Grid>
      <Grid item xs={12} md={5}>
        <SectionLabel>Agregar nuevo método</SectionLabel>
        <Box sx={{ background: 'rgba(42,34,16,0.5)', border: '1px dashed rgba(232,160,32,0.25)',
          borderRadius: '14px', p: 3 }}>
          {['Número de tarjeta','Vencimiento','CVV','Titular'].map((f) => (
            <Skeleton key={f} height={48} sx={{ background: 'rgba(232,160,32,0.06)', borderRadius: '10px', mb: 1.5, transform: 'none' }} />
          ))}
          <Skeleton height={44} sx={{ background: 'rgba(232,160,32,0.14)', borderRadius: '10px', transform: 'none' }} />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

// ─── ADMIN — VENTAS ────────────────────────────────────────

const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <Box sx={{ background: 'rgba(42,34,16,0.5)', border: '1px solid rgba(232,160,32,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', gap: 2, px: 2.5, py: 1.5, borderBottom: '1px solid rgba(232,160,32,0.08)', background: 'rgba(232,160,32,0.04)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width={`${100 / cols}%`} height={18} sx={{ background: 'rgba(232,160,32,0.1)' }} />
      ))}
    </Box>
    {Array.from({ length: rows }).map((_, r) => (
      <Box key={r} sx={{ display: 'flex', gap: 2, px: 2.5, py: 1.2, borderBottom: '1px solid rgba(232,160,32,0.05)' }}>
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} width={`${100 / cols}%`} height={18} sx={{ background: 'rgba(232,160,32,0.06)' }} />
        ))}
      </Box>
    ))}
  </Box>
);

const StatsRow = ({ count = 4 }) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Grid item xs={6} sm={3} key={i}>
        <Box sx={{ background: 'rgba(42,34,16,0.6)', border: '1px solid rgba(232,160,32,0.12)',
          borderRadius: '14px', p: 2.5 }}>
          <Skeleton width="40%" height={14} sx={{ background: 'rgba(232,160,32,0.07)', mb: 1 }} />
          <Skeleton width="60%" height={28} sx={{ background: 'rgba(232,160,32,0.1)' }} />
        </Box>
      </Grid>
    ))}
  </Grid>
);

const ActionBar = () => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
    <Skeleton width={180} height={40} sx={{ background: 'rgba(232,160,32,0.07)', borderRadius: '10px', transform: 'none' }} />
    <Skeleton width={120} height={40} sx={{ background: 'rgba(232,160,32,0.07)', borderRadius: '10px', transform: 'none' }} />
    <Box sx={{ flex: 1 }} />
    <Skeleton width={140} height={40} sx={{ background: 'rgba(232,160,32,0.15)', borderRadius: '10px', transform: 'none' }} />
  </Box>
);

export const ClientesScreen = () => (<Box><StatsRow /><ActionBar /><SectionLabel>Listado de clientes</SectionLabel><TableSkeleton rows={6} cols={5} /></Box>);
export const PedidosScreen = () => (<Box><StatsRow /><ActionBar /><SectionLabel>Gestión de pedidos</SectionLabel><TableSkeleton rows={7} cols={6} /></Box>);
export const PresupuestosScreen = () => (<Box><ActionBar /><SectionLabel>Presupuestos generados</SectionLabel><TableSkeleton rows={5} cols={5} /></Box>);
export const ComprobantesVentaScreen = () => (<Box><ActionBar /><SectionLabel>Comprobantes de venta</SectionLabel><TableSkeleton rows={6} cols={6} /></Box>);
export const ComprobantesPagoScreen = () => (<Box><ActionBar /><SectionLabel>Comprobantes de pago</SectionLabel><TableSkeleton rows={5} cols={5} /></Box>);

export const CierreCajaScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Box sx={{ background: 'rgba(42,34,16,0.6)', border: '1px solid rgba(232,160,32,0.15)', borderRadius: '16px', p: 3 }}>
          <SectionLabel>Resumen del día</SectionLabel>
          {['Apertura de caja','Total ventas','Total cobrado','Diferencia'].map((l) => (
            <Box key={l} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Skeleton width="45%" height={20} sx={{ background: 'rgba(232,160,32,0.07)' }} />
              <Skeleton width="30%" height={20} sx={{ background: 'rgba(232,160,32,0.07)' }} />
            </Box>
          ))}
          <Skeleton height={44} sx={{ background: 'rgba(39,174,96,0.15)', borderRadius: '10px', mt: 2, transform: 'none' }} />
        </Box>
      </Grid>
      <Grid item xs={12} md={7}>
        <SectionLabel>Movimientos del turno</SectionLabel>
        <TableSkeleton rows={6} cols={4} />
      </Grid>
    </Grid>
  </Box>
);

// ─── ADMIN — PRODUCCIÓN ────────────────────────────────────

export const OrdenProduccionScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <SectionLabel>Órdenes activas</SectionLabel>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[1,2,3].map((i) => (
        <Grid item xs={12} sm={4} key={i}>
          <Box sx={{ background: 'rgba(42,34,16,0.55)', border: '1px solid rgba(232,160,32,0.12)', borderRadius: '14px', p: 2.5 }}>
            <Skeleton width="70%" height={22} sx={{ background: 'rgba(232,160,32,0.1)', mb: 1 }} />
            <Skeleton width="50%" height={16} sx={{ background: 'rgba(232,160,32,0.07)', mb: 1.5 }} />
            <Skeleton variant="rounded" height={8} sx={{ background: 'rgba(232,160,32,0.12)', borderRadius: '4px' }} />
          </Box>
        </Grid>
      ))}
    </Grid>
    <SectionLabel>Historial de producción</SectionLabel>
    <TableSkeleton rows={4} cols={5} />
  </Box>
);

export const RecetasScreen = () => (
  <Box>
    <ActionBar />
    <Grid container spacing={2.5}>
      {[1,2,3,4,5,6].map((i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Box sx={{ background: 'rgba(42,34,16,0.55)', border: '1px solid rgba(232,160,32,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
            <Skeleton height={130} sx={{ background: 'rgba(232,160,32,0.07)', transform: 'none' }} />
            <Box sx={{ p: 2 }}>
              <Skeleton width="60%" height={20} sx={{ background: 'rgba(232,160,32,0.09)', mb: 0.5 }} />
              <Skeleton width="40%" height={15} sx={{ background: 'rgba(232,160,32,0.06)' }} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export const ProductosCompuestosScreen = () => (<Box><ActionBar /><SectionLabel>Productos compuestos</SectionLabel><TableSkeleton rows={6} cols={5} /></Box>);
export const MateriaPrimaScreen = () => (<Box><StatsRow count={3} /><ActionBar /><SectionLabel>Inventario de materia prima</SectionLabel><TableSkeleton rows={7} cols={5} /></Box>);
export const StockScreen = () => (
  <Box>
    <StatsRow />
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}><SectionLabel>Stock por producto</SectionLabel><TableSkeleton rows={8} cols={5} /></Grid>
      <Grid item xs={12} md={4}>
        <SectionLabel>Alertas de stock</SectionLabel>
        {[1,2,3].map((i) => (
          <Box key={i} sx={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: '12px', p: 2, mb: 1.5 }}>
            <Skeleton width="65%" height={18} sx={{ background: 'rgba(192,57,43,0.12)' }} />
            <Skeleton width="40%" height={14} sx={{ background: 'rgba(192,57,43,0.08)', mt: 0.5 }} />
          </Box>
        ))}
      </Grid>
    </Grid>
  </Box>
);

// ─── ADMIN — COMPRAS ────────────────────────────────────────

export const ProveedoresScreen = () => (<Box><ActionBar /><SectionLabel>Directorio de proveedores</SectionLabel><TableSkeleton rows={7} cols={5} /></Box>);
export const OrdenCompraScreen = () => (<Box><StatsRow count={3} /><ActionBar /><SectionLabel>Órdenes de compra</SectionLabel><TableSkeleton rows={6} cols={6} /></Box>);
export const PresupuestoProveedorScreen = () => (<Box><ActionBar /><SectionLabel>Presupuestos de proveedores</SectionLabel><TableSkeleton rows={5} cols={5} /></Box>);
export const FacturasRemitosScreen = () => (<Box><ActionBar /><SectionLabel>Facturas y remitos</SectionLabel><TableSkeleton rows={6} cols={6} /></Box>);

// ─── ADMIN — MANTENIMIENTO ─────────────────────────────────

export const MaquinariaScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <Grid container spacing={2.5}>
      {[1,2,3,4].map((i) => (
        <Grid item xs={12} sm={6} key={i}>
          <Box sx={{ background: 'rgba(42,34,16,0.55)', border: '1px solid rgba(232,160,32,0.12)', borderRadius: '14px', p: 2.5, display: 'flex', gap: 2 }}>
            <Skeleton variant="rounded" width={56} height={56} sx={{ background: 'rgba(232,160,32,0.1)', borderRadius: '12px', flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" height={20} sx={{ background: 'rgba(232,160,32,0.09)', mb: 0.5 }} />
              <Skeleton width="40%" height={15} sx={{ background: 'rgba(232,160,32,0.06)', mb: 1 }} />
              <Skeleton variant="rounded" height={6} sx={{ background: 'rgba(39,174,96,0.2)', borderRadius: '3px' }} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export const OrdenesMantScreen = () => (<Box><StatsRow count={3} /><ActionBar /><SectionLabel>Órdenes de mantenimiento</SectionLabel><TableSkeleton rows={6} cols={5} /></Box>);
