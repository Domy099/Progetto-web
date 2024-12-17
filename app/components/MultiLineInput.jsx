import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MultilineTextFields({ value, onChange, placeholder }) {
  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
           multiline
           rows={4} // Numero di righe visibili
           variant="outlined"
           fullWidth
           value={value} // Stato controllato
           onChange={onChange} // Passa direttamente l'evento
           placeholder={placeholder}
        />
      </div>
    </Box>
  );
}