import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const LeggiDiPiu = ({ text, lunghezza }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <Typography variant="body1" textAlign={'justify'}>
        {isExpanded ? text : `${text.slice(0, lunghezza)}...`}
      </Typography>
      {text.length > lunghezza && (
        <Link component="button" onClick={handleToggle} sx={{ textDecoration: 'none', typography: 'label', color: '#628caf', }}>
          {isExpanded ? 'Leggi meno' : 'Leggi di più'}
        </Link>
      )}
    </div>
  );
};

export default LeggiDiPiu;