import PropTypes from 'prop-types';
import { Alert, AlertTitle, Button, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const ClienteMorosoAlert = ({ cliente, onVerDetalle }) => {
  if (!cliente || !cliente.estadoMoroso) return null;

  return (
    <Alert
      severity="error"
      icon={<WarningAmberIcon fontSize="inherit" />}
      sx={{
        borderRadius: '12px',
        mb: 2,
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(206, 43, 55, 0.15)',
        border: '1px solid rgba(206, 43, 55, 0.3)',
      }}
      action={
        onVerDetalle && (
          <Button color="inherit" size="small" onClick={() => onVerDetalle(cliente)} sx={{ fontWeight: 700, textTransform: 'none' }}>
            Ver Situación
          </Button>
        )
      }
    >
      <AlertTitle sx={{ fontWeight: 700 }}>
        ¡Alerta de Cliente Moroso! - Venta a Crédito Bloqueada
      </AlertTitle>
      <Typography variant="body2">
        El cliente <strong>{cliente.razonSocial}</strong> presenta <strong>{cliente.diasAtraso} días de atraso</strong> en el pago mensual de su cuenta corriente.
        Por política del Trabajo Práctico, el sistema ha bloqueado automáticamente la posibilidad de emitir nuevos pedidos a crédito a este cliente. Solo se permiten cobros en efectivo o de contado.
      </Typography>
    </Alert>
  );
};

ClienteMorosoAlert.propTypes = {
  cliente: PropTypes.object,
  onVerDetalle: PropTypes.func,
};

export default ClienteMorosoAlert;
