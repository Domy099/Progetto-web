import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const POICard = ({ nome, descrizione }) => {
  return (
    <Card 
      sx={{ 
        mb: 2,
        maxWidth: 400,
        height: '100%',
        backgroundColor: 'background.paper',
        borderRadius: 3,  // Arrotondamento dei bordi
      }}
    >
      <CardContent 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          p: 3,
          '&:last-child': { pb: 3 }  // Override default padding bottom
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <LocationOnIcon 
            sx={{ 
              fontSize: 64,
              color: 'red',  // Colore dell'icona (puoi sostituire 'primary.main' con qualsiasi colore desiderato)
            }} 
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>  {/* Per gestire correttamente il text overflow */}
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              mb: 1,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {nome}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {descrizione}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default POICard;
