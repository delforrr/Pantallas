import { useRef, useState } from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { FormDialog } from './ModuleUI';
export function DocumentoUploader({
  label = 'Documento adjunto',
  value = '',
  onChange,
  helperText = 'JPG, PNG, WebP o PDF. Máximo 10 MB.',
  readOnly = false,
  required = false
}) {
  const input = useRef(null);
  const [preview, setPreview] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const pdf = value.startsWith('data:application/pdf') || /\.pdf(?:[?#]|$)/i.test(value);
  const load = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setError('Elegí un archivo JPG, PNG, WebP o PDF de hasta 10 MB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileName(file.name);
      setError('');
      onChange?.(reader.result);
    };
    reader.onerror = () => setError('No se pudo leer el archivo. Intentá seleccionarlo nuevamente.');
    reader.readAsDataURL(file);
  };
  return <Stack sx={{
    ...{
      minWidth: 0
    },
    gap: 1.5
  }}>
    {!readOnly && <input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={load} aria-label={label} />}
    <Paper variant="outlined" sx={{
      p: 2,
      borderRadius: 2,
      minWidth: 0
    }}><Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
      <Box sx={{ minWidth: 0, flex: '1 1 180px' }}>
        <Typography variant="subtitle2">{label}{required ? ' *' : ''}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere', mt: 0.5 }}>{value ? fileName || 'Documento adjunto disponible' : 'Sin documento adjunto.'}</Typography>
        {!readOnly && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{helperText}</Typography>}
      </Box>
      <Stack direction="row" sx={{
          gap: 1,
          flexWrap: "wrap"
        }}>
        {value && <Button variant="outlined" onClick={() => setPreview(true)}>Ver documento</Button>}
        {!readOnly && <Button variant="outlined" onClick={() => input.current?.click()}>{value ? 'Cambiar documento' : 'Adjuntar documento'}</Button>}
        {!readOnly && value && <Button variant="outlined" color="error" onClick={() => {
            onChange?.('');
            setFileName('');
            if (input.current) input.current.value = '';
          }}>Quitar documento</Button>}

      </Stack>
    </Stack></Paper>
    {error && <Alert severity="error">{error}</Alert>}
    <FormDialog open={preview} onClose={() => setPreview(false)} title={label} maxWidth="md">
      {pdf ? <Box component="object" data={value} type="application/pdf" aria-label="Vista previa del PDF" sx={{
        width: '100%',
        height: '65dvh'
      }}><Typography>No se pudo mostrar el PDF. <a href={value} download={fileName || 'documento.pdf'}>Descargar documento</a></Typography></Box> : <Box component="img" src={value || undefined} alt={fileName || label} sx={{
        maxWidth: '100%',
        height: 'auto',
        objectFit: 'contain'
      }} />}
    </FormDialog>
  </Stack>;
}
