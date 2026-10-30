import AddIcon from '@mui/icons-material/Add';
import { alpha } from '@mui/material/styles';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { Children, cloneElement, isValidElement, useId, useState } from 'react';
import { Box, Button, Chip, Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, ToggleButton, ToggleButtonGroup, Typography, Tooltip, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
export function ModuleSurface({
  children
}) {
  return <Box sx={{
    minWidth: 0,
    '& .MuiButton-root': {
      minHeight: 44,
      whiteSpace: 'normal'
    },
    '& .MuiIconButton-root, & .MuiToggleButton-root': {
      minHeight: 44,
      minWidth: 44
    },
    '& .MuiTableContainer-root': {
      maxWidth: '100%',
      overflowX: 'auto'
    },
    '& .MuiTableCell-root .MuiButton-root': { whiteSpace: 'nowrap' },
    '& .MuiButton-contained.MuiButton-colorPrimary': {
      bgcolor: theme => theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
      color: theme => theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white,
      '&:hover': { bgcolor: theme => theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark }
    },
    '& .MuiButton-outlined.MuiButton-colorPrimary, & .MuiButton-text.MuiButton-colorPrimary': { color: theme => theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark },
    '& .MuiButton-contained.MuiButton-colorError': { bgcolor: 'error.dark', color: 'common.white' },
    '& .MuiTypography-body2': { fontSize: '0.875rem' },
    '& .MuiIconButton-root.Mui-focusVisible, & .MuiToggleButton-root.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
    '& .MuiInputBase-root': {
      minHeight: 44
    },
    '& .MuiInputBase-input': {
      minWidth: 0
    },
    '& .MuiTypography-root': {
      overflowWrap: 'anywhere'
    },
    '& .MuiTypography-noWrap': {
      whiteSpace: 'normal',
      overflow: 'visible'
    },
    '& .MuiPaper-root': {
      minWidth: 0
    },
    '& .MuiPaper-root:hover': {
      transform: 'none'
    },
    '@media (prefers-reduced-motion: reduce)': {
      '& *': {
        animation: 'none !important',
        transition: 'none !important',
        transform: 'none !important'
      }
    }
  }}>{children}</Box>;
}
export function ModuleDialog({
  children,
  slotProps = {},
  sx,
  'aria-labelledby': labelledBy,
  ...props
}) {
  const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const titleId = useId();
  const paper = slotProps.paper || {};
  return <MuiDialog {...props} fullScreen={mobile} aria-labelledby={labelledBy || titleId} slotProps={{
    ...slotProps,
    paper: {
      ...paper,
      sx: {
        ...paper.sx,
        maxHeight: mobile ? '100dvh' : '90dvh',
        backgroundImage: 'none',
        bgcolor: 'background.paper',
        borderRadius: mobile ? 0 : 3,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
      }
    }
  }} sx={[{
    '& .MuiDialogTitle-root': {
      flexShrink: 0,
      p: {
        xs: 2,
        sm: 3
      },
      overflowWrap: 'anywhere',
      '& > .MuiBox-root': {
        minWidth: 0
      }
    },
    '& .MuiDialogContent-root': {
      p: {
        xs: 2,
        sm: 3
      },
      minHeight: 0,
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    '& .MuiDialogActions-root': {
      p: 2,
      gap: 1,
      flexShrink: 0,
      flexWrap: 'wrap',
      bgcolor: 'background.paper',
      '& > :not(style) ~ :not(style)': {
        ml: 0
      },
      '& .MuiButton-root': {
        flex: {
          xs: '1 1 100%',
          sm: '0 1 auto'
        }
      }
    },
    '& .MuiButton-root': {
      minHeight: 44,
      whiteSpace: 'normal'
    },
    '& .MuiIconButton-root': {
      minWidth: 44,
      minHeight: 44
    },
    '& .MuiButton-contained.MuiButton-colorPrimary': {
      bgcolor: theme => theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
      color: theme => theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white,
      '&:hover': { bgcolor: theme => theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark }
    },
    '& .MuiButton-outlined.MuiButton-colorPrimary, & .MuiButton-text.MuiButton-colorPrimary': { color: theme => theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark },
    '& .MuiButton-contained.MuiButton-colorError': { bgcolor: 'error.dark', color: 'common.white' },
    '& .MuiTypography-body2': { fontSize: '0.875rem' },
    '& .MuiIconButton-root.Mui-focusVisible, & .MuiToggleButton-root.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
    '& .MuiInputBase-root': {
      minHeight: 44
    },
    '& .MuiTableContainer-root': {
      overflowX: 'auto',
      maxWidth: '100%'
    },
    '& .MuiTypography-root': {
      overflowWrap: 'anywhere'
    },
    '& .MuiTypography-noWrap': {
      whiteSpace: 'normal',
      overflow: 'visible'
    },
    '& .MuiPaper-root': {
      minWidth: 0
    },
    '& .MuiPaper-root:hover': {
      transform: 'none'
    },
    '@media (prefers-reduced-motion: reduce)': {
      '& *': {
        animation: 'none !important',
        transition: 'none !important',
        transform: 'none !important'
      }
    }
  }, ...(Array.isArray(sx) ? sx : [sx])]}>{Children.map(children, child => isValidElement(child) && child.type === DialogTitle ? cloneElement(child, {
      id: titleId
    }) : child)}</MuiDialog>;
}
export function FormDialog({
  open,
  onClose,
  title,
  status,
  footerActions,
  onSubmit,
  children,
  action = 'Guardar cambios',
  maxWidth = 'md'
}) {
  const headingId = useId();
  return <ModuleDialog aria-labelledby={headingId} open={open} onClose={onClose} fullWidth maxWidth={maxWidth} slotProps={{
    paper: onSubmit ? {
      component: 'form',
      onSubmit: event => {
        const form = event.currentTarget;
        onSubmit(event);
        requestAnimationFrame(() => {
          if (!form.isConnected) return;
          const invalid = form.querySelector('[aria-invalid="true"]') || [...form.querySelectorAll('[role="alert"]')].at(-1);
          if (invalid) {
            invalid.setAttribute('tabindex', '-1');
            invalid.focus();
          }
        });
      }
    } : {}
  }}>
    <DialogTitle component="div"><Stack direction="row" sx={{
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 1
      }}><Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}><Typography id={headingId} component="h2" variant="h6" sx={{
          fontWeight: 700
        }}>{title}</Typography>{status && <StatusChip value={status} />}</Stack><IconButton aria-label="Cerrar diálogo" onClick={onClose}><CloseIcon /></IconButton></Stack></DialogTitle>
    <DialogContent dividers><Stack sx={{
        gap: 2.5
      }}>{children}</Stack></DialogContent>
    <DialogActions sx={{ justifyContent: 'flex-end' }}>{footerActions && <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mr: 'auto', maxWidth: '100%' }}>{footerActions}</Stack>}<Button variant="outlined" onClick={onClose} color="inherit">{onSubmit ? 'Cancelar' : 'Cerrar'}</Button>{onSubmit && <Button type="submit" variant="contained">{action}</Button>}</DialogActions>
  </ModuleDialog>;
}
export function StatusChip({
  value
}) {
  const colors = {
    Inactivo: 'default', Vencido: 'warning', 'Fuera de Servicio': 'error',
    Activo: 'success', Pagada: 'success', 'Pendiente de Pago': 'warning', Anulada: 'error', Conciliado: 'success',
    Operativa: 'success',
    Aprobado: 'success',
    Cumplida: 'success',
    Finalizada: 'success',
    Enviada: 'info',
    'En Proceso': 'info',
    Pendiente: 'warning',
    'Recibida Parcial': 'warning',
    'En Mantenimiento': 'warning',
    'En Reparación': 'error',
    Cancelada: 'error',
    Rechazado: 'error'
  };
  const color = colors[value] || 'default';
  return <Chip size="small" label={value} icon={<Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />} sx={{
    maxWidth: '100%', height: 'auto', minHeight: 28, borderRadius: 1.5,
    fontWeight: 650, fontSize: '0.75rem',
    color: theme => color === 'default' ? theme.palette.text.secondary : theme.palette[color][theme.palette.mode === 'dark' ? 'light' : 'dark'],
    bgcolor: theme => alpha(color === 'default' ? theme.palette.text.secondary : theme.palette[color].main, theme.palette.mode === 'dark' ? 0.16 : 0.09),
    border: '1px solid',
    borderColor: theme => alpha(color === 'default' ? theme.palette.text.secondary : theme.palette[color].main, 0.25),
    '& .MuiChip-icon': { color: 'inherit', ml: 1.25, mr: 0 },
    '& .MuiChip-label': { px: 1, py: 0.5, whiteSpace: 'nowrap' }
  }} />;
}
export function ListToolbar({
  search,
  onSearch,
  status,
  onStatus,
  statuses,
  onCreate,
  createLabel,
  children,
  viewControls,
  showStatus = true,
  filterActive = false,
  onClear
}) {
  return <Stack role="group" aria-label="Filtros de registros" sx={{
    gap: 1.5,
    mb: 1.5
  }}>
    <Stack direction={{
      xs: 'column',
      sm: 'row'
    }} sx={{
      gap: 1.5,
      flexWrap: "wrap",
      alignItems: { xs: "stretch", sm: "center" }
    }}>
      <TextField label="Buscar" placeholder="Código, descripción o responsable" value={search} onChange={e => onSearch(e.target.value)} sx={{
        flex: '1 1 180px',
        minWidth: 0,
        '@media (max-width:599px)': {
          flexBasis: 'auto'
        }
      }} />
      {showStatus && <TextField select label="Estado" value={status} onChange={e => onStatus(e.target.value)} sx={{
        minWidth: {
          sm: 160
        }
      }}><MenuItem value="TODOS">Todos los estados</MenuItem>{statuses.map(s => <MenuItem value={s} key={s}>{s}</MenuItem>)}</TextField>}
      {children}<Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0, maxWidth: '100%' }}>
        {viewControls}{onCreate && <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate} sx={{ minWidth: 0, flex: { xs: 1, sm: '0 1 auto' } }}>{createLabel}</Button>}
      </Stack>
    </Stack>
    {(search || status !== 'TODOS' || filterActive) && <Button variant="outlined" startIcon={<FilterAltOffIcon />} sx={{ alignSelf: 'flex-start' }} onClick={onClear || (() => { onSearch(''); onStatus('TODOS'); })}>Limpiar filtros</Button>}
  </Stack>;
}
export function RecordsView({
  rows,
  columns,
  actions,
  cardTitle,
  toolbar,
  empty,
  onClear
}) {
  const compact = useMediaQuery(theme => theme.breakpoints.down('md'));
  const [view, setView] = useState(null);
  const cards = view === 'cards' || !view && compact;
  const viewControls = <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}><ToggleButtonGroup exclusive value={cards ? 'cards' : 'table'} onChange={(_, value) => value && setView(value)} aria-label="Presentación de registros" sx={{
      flexShrink: 0
    }}><Tooltip title="Vista de tabla" arrow><ToggleButton value="table" aria-label="Vista de tabla"><ViewListIcon /></ToggleButton></Tooltip><Tooltip title="Vista de tarjetas" arrow><ToggleButton value="cards" aria-label="Vista de tarjetas"><ViewModuleIcon /></ToggleButton></Tooltip></ToggleButtonGroup></Stack>;
  return <Stack sx={{ gap: 2 }}>
    {toolbar ? cloneElement(toolbar, { viewControls }) : viewControls}
    {!rows.length ? <Paper variant="outlined" sx={{
      p: 3
    }}><Typography>{empty}</Typography>{onClear && <Button variant="outlined" startIcon={<FilterAltOffIcon />} onClick={onClear}>Limpiar filtros</Button>}</Paper> : cards ? <Box sx={{
      display: 'grid',
      gap: 2,
      gridTemplateColumns: {
        xs: 'minmax(0, 1fr)',
        sm: 'repeat(2, minmax(0, 1fr))',
        lg: 'repeat(3, minmax(0, 1fr))'
      }
    }}>{rows.map(row => {
      const mainField = columns.find(c => ['Proveedor', 'Máquina', 'Descripción'].includes(c.label));
      const metadata = columns.filter((c, index) => index > 0 && c !== mainField && !c.label.startsWith('Estado'));
      const statusField = columns.find(c => c.label.startsWith('Estado'));
      return <Paper key={row.id} variant="outlined" sx={{ p: 2, borderRadius: '14px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1.25 }}>
          <Typography component="h3" variant="body2" sx={{ fontWeight: 700, fontFamily: mainField === columns[0] ? 'inherit' : 'monospace', color: mainField === columns[0] ? 'text.primary' : 'text.secondary', minWidth: 0 }}>{cardTitle(row)}</Typography>
          {statusField && <Box sx={{ flexShrink: 0 }}>{statusField.render(row)}</Box>}
        </Stack>
        {mainField && mainField !== columns[0] && <Box sx={{ fontSize: '1rem', fontWeight: 650, lineHeight: 1.4, mb: 2 }}>{mainField.render(row)}</Box>}
        <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: metadata.length === 3 && !metadata.some(c => c.numeric) ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))' }, columnGap: 2, rowGap: 1.5, m: 0, mb: 2 }}>
          {metadata.map(c => <Box key={c.label} sx={{ minWidth: 0 }}><Typography component="dt" variant="caption" color="text.secondary" sx={{ mb: 0.25 }}>{c.label}</Typography><Box component="dd" sx={{ m: 0, fontSize: '0.875rem', fontWeight: c.numeric ? 700 : 500, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{c.render(row)}</Box></Box>)}
        </Box>
        <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', justifyContent: 'flex-end', mt: 'auto', pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>{actions(row)}</Stack>
      </Paper>;
    })}</Box> : <TableContainer component={Paper} variant="outlined" tabIndex={0} aria-label="Registros, desplazamiento horizontal disponible" sx={{
      borderRadius: '14px'
    }}><Table sx={{
        minWidth: 700
      }}><TableHead><TableRow>{columns.map(c => <TableCell key={c.label} align={c.numeric ? 'right' : 'left'} sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{c.label}</TableCell>)}<TableCell align="right" sx={{ position: { xs: 'static', md: 'sticky' }, right: 0, bgcolor: 'background.paper', zIndex: 1 }}>Acciones</TableCell></TableRow></TableHead><TableBody>{rows.map(row => <TableRow key={row.id}>{columns.map(c => <TableCell key={c.label} align={c.numeric ? 'right' : 'left'} sx={{ whiteSpace: ['Proveedor','Descripción','Máquina','Técnico','Categoría'].includes(c.label) ? 'normal' : 'nowrap', minWidth: ['Proveedor','Descripción','Máquina','Técnico','Categoría'].includes(c.label) ? 180 : 90 }}>{c.render(row)}</TableCell>)}<TableCell sx={{ position: { xs: 'static', md: 'sticky' }, right: 0, bgcolor: 'background.paper', borderLeft: '1px solid', borderLeftColor: 'divider' }}><Stack direction="row" sx={{
                gap: 1,
                justifyContent: "flex-end",
                flexWrap: "nowrap"
              }}>{actions(row)}</Stack></TableCell></TableRow>)}</TableBody></Table></TableContainer>}
  </Stack>;
}

export function RecordIcon({ label, color = 'default', onClick, children }) {
  return <Tooltip title={label} arrow><IconButton aria-label={label} color={color} onClick={onClick} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 44, minHeight: 44 }}>{children}</IconButton></Tooltip>;
}

export function SummaryCards({ items }) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: `repeat(${items.length}, minmax(0, 1fr))` }, gap: 1.5, mb: 2 }}>
    {items.map(({ label, value, color = 'primary.main' }) => <Paper key={label} variant="outlined" sx={{
      p: { xs: 1.5, sm: 2 }, borderRadius: '14px', minWidth: 0,
      gridColumn: { xs: typeof value === 'string' ? 'span 2' : 'auto', md: 'auto' },
      backgroundImage: 'none', position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5,
      '&::before': { content: '""', position: 'absolute', inset: '0 auto 0 0', width: 3, bgcolor: color }
    }}>
      <Stack sx={{ gap: 0.75, minWidth: 0 }}><Box sx={{ width: 20, height: 3, borderRadius: 1, bgcolor: color }} /><Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.4 }}>{label}</Typography></Stack>
      <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, px: { xs: 1, sm: 1.5 }, py: 0.75, flexShrink: 1, minWidth: 0 }}><Typography component="p" sx={{ fontWeight: 750, fontSize: { xs: typeof value === 'string' ? '0.95rem' : '1.6rem', sm: typeof value === 'string' ? '1.2rem' : '1.9rem' }, lineHeight: 1.2, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{value}</Typography></Box>
    </Paper>)}
  </Box>;
}

export function FormSection({ number, title, children }) {
  const titleId = useId();
  return <Paper component="section" aria-labelledby={titleId} variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: '14px', backgroundImage: 'none' }}>
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2 }}><AssignmentOutlinedIcon fontSize="small" sx={{ color: 'primary.main', flexShrink: 0 }} /><Typography id={titleId} component="h3" variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{number}. {title}</Typography></Stack>
    <Stack sx={{ gap: 2, minWidth: 0 }}>{children}</Stack>
  </Paper>;
}
