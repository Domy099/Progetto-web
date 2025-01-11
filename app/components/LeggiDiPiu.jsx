import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const LeggiDiPiu = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 600; // Lunghezza massima per troncare

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <Typography variant="body1" color="text.secondary" textAlign={'justify'}>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`} {/* Mostra il testo troncato o completo */}
      </Typography>
      {text.length > maxLength && (
        <Link component="button" onClick={handleToggle} sx={{ textDecoration: 'none', color: '#1976d2' }}>
          {isExpanded ? 'Leggi meno' : 'Leggi di più'}
        </Link>
      )}
    </div>
  );
};

export default LeggiDiPiu;