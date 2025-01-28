import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../public/theme';

const DashboardMenu = ({ onSelect }) => {
  const [selectedSection, setSelectedSection] = useState('Biglietti');

  const handleChipClick = (section) => {
    setSelectedSection(section);
    onSelect(section);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {['Biglietti', 'Feedback', 'Gestione Profilo'].map((section) => (
          <Chip
            key={section}
            label={section}
            clickable
            color={selectedSection === section ? 'primary' : 'default'}
            onClick={() => handleChipClick(section)}
            sx={{
              backgroundColor: selectedSection === section ? '#408eb5' : '#e0e0e0',
              '&:hover': { backgroundColor: '#ed96c8' },
              typography: 'label',
            }}
          />
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default DashboardMenu;
