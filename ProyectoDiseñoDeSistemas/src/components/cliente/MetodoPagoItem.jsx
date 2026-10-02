import PropTypes from 'prop-types';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export const MetodoPagoItem = ({ metodo, onSetDefault, onDelete }) => {
  if (!metodo) return null;

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'efectivo':
        return <PaymentsOutlinedIcon sx={{ fontSize: 28, color: 'success.main' }} />;
      case 'debito':
        return <CreditCardOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />;
      case 'mercadopago':
        return <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 28, color: 'info.main' }} />;
      case 'cuentadni':
        return <PhoneAndroidOutlinedIcon sx={{ fontSize: 28, color: 'success.dark' }} />;
      case 'cuentacorriente':
        return <AccountBalanceOutlinedIcon sx={{ fontSize: 28, color: 'secondary.main' }} />;
      default:
        return <CreditCardOutlinedIcon sx={{ fontSize: 28, color: 'text.secondary' }} />;
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: '14px',
        border: '1px solid',
        borderColor: metodo.esDefault ? 'primary.main' : 'divider',
        p: 2.5,
        mb: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        bgcolor: metodo.esDefault ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.light',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {getIcon(metodo.tipo)}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {metodo.nombre}
            </Typography>
            {metodo.esDefault ? (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                label="Predeterminado"
                size="small"
                color="primary"
                sx={{ fontWeight: 700, fontSize: '0.75rem' }}
              />
            ) : (
              <Chip
                label={metodo.badge || 'Autorizado'}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.75rem', borderColor: 'divider' }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {metodo.detalle}
          </Typography>
        </Box>
      </Box>

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
        {!metodo.esDefault && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<StarBorderIcon />}
            onClick={() => onSetDefault && onSetDefault(metodo.idMedioDePago)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          >
            Hacer Predeterminado
          </Button>
        )}

        <Tooltip
          title={
            metodo.esDefault
              ? 'No es posible eliminar el método de pago predeterminado'
              : 'Eliminar medio de pago'
          }
        >
          <span>
            <IconButton
              size="small"
              color="error"
              disabled={metodo.esDefault}
              onClick={() => onDelete && onDelete(metodo.idMedioDePago)}
              aria-label={`Eliminar ${metodo.nombre}`}
              sx={{
                border: '1px solid',
                borderColor: metodo.esDefault ? 'transparent' : 'error.light',
                borderRadius: '8px',
                p: 0.8,
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
};

MetodoPagoItem.propTypes = {
  metodo: PropTypes.shape({
    idMedioDePago: PropTypes.number,
    tipo: PropTypes.string,
    nombre: PropTypes.string,
    detalle: PropTypes.string,
    badge: PropTypes.string,
    esDefault: PropTypes.bool,
  }),
  onSetDefault: PropTypes.func,
  onDelete: PropTypes.func,
};

export default MetodoPagoItem;
