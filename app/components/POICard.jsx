import React from 'react';
import Link from 'next/link';
import { Card, CardContent, Typography, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const POICard = ({ nome, descrizione, marker, longitudine, latitudine }) => {
  return (
    <Card
      sx={{
        mb: 2,
        minHeight: 150,
        maxHeight: 150,
        maxWidth: 400,
        height: '100%',
        backgroundColor: 'background.paper',
        borderRadius: 5,  // Arrotondamento dei bordi
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
          {/* Se è presente un marker, viene visualizzato altrimenti viene mostrata l'icona di default */}
          {marker ? (
            <img
              src={marker}
              alt="Marker"
              style={{
                width: 64,
                height: 64,
                objectFit: 'cover',
                margin: 1,
              }}
            />) : (

            <LocationOnIcon
              sx={{
                fontSize: 64,
                color: 'red',  // Colore dell'icona (puoi sostituire 'primary.main' con qualsiasi colore desiderato)
              }}
            />)
          }

        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h3"
            component="h3"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {nome}
          </Typography>

          <Typography
            component="a"
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitudine},${longitudine}`}
            target="_blank"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              textDecoration: 'none',
              
              fontSize: 15,
              '&:hover': {
                textDecoration: 'underline',
              }

            }}
          >
            Vai a Google Maps
          </Typography>

          <Typography
            variant="body1"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: 16,
              mt: 1.2,
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
