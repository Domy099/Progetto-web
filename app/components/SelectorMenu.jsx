import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../public/theme';

const SelectorMenu = ({ options, defaultSelected, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(defaultSelected);

  const handleChipClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            clickable
            color={selectedOption === option ? 'primary' : 'default'}
            onClick={() => handleChipClick(option)}
            sx={{
              backgroundColor: selectedOption === option ? '#408eb5' : '#e0e0e0',
              '&:hover': { backgroundColor: '#ed96c8' },
              typography: 'label',
            }}
          />
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default SelectorMenu; 