import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CarnivaleParadeMenus = ({ onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedParade, setSelectedParade] = useState('Sfilata 1');
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (parade, paradeNumber) => {
    setAnchorEl(null);
    if (parade && paradeNumber) {
      setSelectedParade(parade); // Aggiorna lo stato interno per mostrare la selezione
      onSelect(paradeNumber); // Passa il numero al componente padre
    }
  };

  return (
    <div>
      <Button
        id="carnival-parade-button"
        aria-controls={open ? 'carnival-parade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          mt: 2, // Margine superiore
          backgroundColor: '#408eb5', // Colore di sfondo personalizzato
          '&:hover': { backgroundColor: '#ed96c8' } // Colore al passaggio del mouse
        }}
      >
        {selectedParade}
      </Button>
      <Menu
        id="carnival-parade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          'aria-labelledby': 'carnival-parade-button',
        }}
      >
        <MenuItem onClick={() => handleClose('Sfilata 1', 1)}>Sfilata 1</MenuItem>
        <MenuItem onClick={() => handleClose('Sfilata 2', 2)}>Sfilata 2</MenuItem>
        <MenuItem onClick={() => handleClose('Sfilata 3', 3)}>Sfilata 3</MenuItem>
        <MenuItem onClick={() => handleClose('Sfilata 4', 4)}>Sfilata 4</MenuItem>
      </Menu>
    </div>
  );
}

export default CarnivaleParadeMenus;
