import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export const DocumentoUploader = ({
  label = "Comprobante / Documento Adjunto",
  value,
  onChange,
  helperText = "Formatos soportados: JPG, PNG, WebP o PDF escaneado (máx. 10MB)",
  mockPlaceholder,
  readOnly = false,
  required = false,
}) => {
  const fileInputRef = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (onChange) {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onChange) {
      onChange("");
    }
  };

  const handleLoadMock = () => {
    if (mockPlaceholder && onChange) {
      setFileName("comprobante_oficial_firmado.png");
      onChange(mockPlaceholder);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header del Uploader */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <InsertDriveFileOutlinedIcon
            fontSize="small"
            sx={{ color: "primary.main" }}
          />
          {label}
          {required && (
            <Typography component="span" color="error.main">
              *
            </Typography>
          )}
        </Typography>

        {value && (
          <Chip
            icon={<CheckCircleOutlineIcon fontSize="small" />}
            label="Documento cargado"
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
          />
        )}
      </Box>

      {/* Input de archivo nativo oculto */}
      {!readOnly && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      )}

      {/* Contenedor del Uploader o Visualizador */}
      {!value ? (
        <Paper
          variant="outlined"
          onClick={() => !readOnly && fileInputRef.current?.click()}
          sx={{
            p: 3,
            borderRadius: "14px",
            borderStyle: "dashed",
            borderWidth: 2,
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.02)"
                : "rgba(0, 0, 0, 0.01)",
            textAlign: "center",
            cursor: readOnly ? "default" : "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: readOnly ? "divider" : "primary.main",
              bgcolor: (theme) => {
                if (readOnly) return "transparent";
                return theme.palette.mode === "dark"
                  ? "rgba(0, 146, 70, 0.06)"
                  : "rgba(0, 146, 70, 0.04)";
              },
            },
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              mx: "auto",
              mb: 1.5,
              borderRadius: "50%",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 146, 70, 0.2)"
                  : "rgba(0, 146, 70, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
            }}
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 30 }} />
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {readOnly
              ? "Sin imagen o comprobante adjunto"
              : "Haga clic para subir la foto/escaneo del comprobante"}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 2 }}
          >
            {helperText}
          </Typography>

          {!readOnly && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloudUploadOutlinedIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ borderRadius: "8px", fontWeight: 600 }}
              >
                Examinar Archivo
              </Button>

              {mockPlaceholder && (
                <Button
                  variant="text"
                  size="small"
                  color="secondary"
                  startIcon={<AutoFixHighIcon />}
                  onClick={handleLoadMock}
                  sx={{ borderRadius: "8px", fontWeight: 600 }}
                >
                  Cargar Ejemplo
                </Button>
              )}
            </Box>
          )}
        </Paper>
      ) : (
        /* Tarjeta de Documento Cargado con Vista Previa */
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: "14px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "none"
                : "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Miniatura clickeable */}
          <Box
            onClick={() => setPreviewOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 64,
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                bgcolor: "action.hover",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={value}
                alt="Vista previa del documento"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {fileName || "Comprobante_Proveedor.jpg"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Haga clic para ampliar o inspeccionar el comprobante
              </Typography>
            </Box>
          </Box>

          {/* Botones de acción */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!readOnly && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ borderRadius: "8px", fontSize: "0.75rem" }}
                >
                  Cambiar
                </Button>
                <Tooltip title="Eliminar comprobante adjunto">
                  <IconButton size="small" color="error" onClick={handleRemove}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Paper>
      )}

      {/* Modal Lightbox de Vista Previa a Pantalla Completa */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            bgcolor: "background.paper",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1.5,
            px: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {label} - Inspección de Documento
          </Typography>
          <IconButton onClick={() => setPreviewOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#121212" : "#f1f5f9",
            minHeight: 350,
          }}
        >
          {value && (
            <Box
              component="img"
              src={value}
              alt="Documento ampliado"
              sx={{
                maxWidth: "100%",
                maxHeight: "70vh",
                borderRadius: "8px",
                boxShadow: 4,
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button onClick={() => setPreviewOpen(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

DocumentoUploader.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  helperText: PropTypes.string,
  mockPlaceholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
};
