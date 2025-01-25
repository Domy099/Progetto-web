import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../public/theme';

const SfilateSelector = ({ onSelect }) => {
  const [selectedParade, setSelectedParade] = useState('Sfilata 1');

  const handleChipClick = (parade, paradeNumber) => {
    setSelectedParade(parade); // Aggiorna lo stato interno per mostrare la selezione
    onSelect(paradeNumber); // Passa il numero al componente padre
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      {['Sfilata 1', 'Sfilata 2', 'Sfilata 3', 'Sfilata 4'].map((parade, index) => (
        <Chip
          key={parade}
          label={parade}
          clickable
          color={selectedParade === parade ? 'primary' : 'default'}
          onClick={() => handleChipClick(parade, index + 1)}
          sx={{
            backgroundColor: selectedParade === parade ? '#408eb5' : '#e0e0e0',
            '&:hover': { backgroundColor: '#a6cfd6' }, // Colore al passaggio del mouse
            typography: 'label', // Applica lo stile h1 alla label del Chip
          }}
        />
      ))}
    </Box>
    </ThemeProvider>
  );
};

export default SfilateSelector;
