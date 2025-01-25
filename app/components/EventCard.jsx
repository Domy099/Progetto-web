"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../public/theme';

export default function EventCard(props) {
  const { title, description, image, altText, tipo, data, orario, posizione } = props;

  const titoloAbbreviato = title.length > 20 ? title.substring(0, 20) + '...' : title;

  const getColoriChip = (tipo) => {
    switch (tipo?.trim().toLowerCase()) {
      case 'concerto':
        return { backgroundColor: '#4caf50',}; // Verde
      case 'sfilata':
        return { backgroundColor: '#2196f3',}; // Blu
      case 'convivialità':
        return { backgroundColor: '#ff9800',  }; // Arancione
      case 'presentazione':
        return { backgroundColor: 'orange', }; // Arancione
      default:
        return { backgroundColor: 'gray', }; // Default
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Card sx={{ maxWidth: 345, position: 'relative', borderRadius: '10px'}}>
      <CardActionArea>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* CardMedia per la locandina */}
          <CardMedia
            component="img"
            height="140" // Imposta l'altezza dell'immagine
            image={image} // URL dell'immagine della locandina
            alt={altText} // Alt text per l'immagine
            sx={{
              borderRadius: '10px', // Arrotonda gli angoli dell'immagine
              width: '100%', // Assicura che l'immagine prenda tutta la larghezza disponibile
              height: 200, // Imposta l'altezza dell'immagine a 200px
              objectFit: 'cover', // Scala l'immagine per coprire l'intero rettangolo senza deformarsi
            }}
          />

          {/* Chip sopra il titolo */}
            <Chip
            label={tipo}
            sx={{
              alignSelf: 'flex-start', // Posiziona il chip a sinistra
              ...getColoriChip(tipo),
              marginBottom: 2, // Distanza dal titolo
              marginTop: 2,
              typography: 'label', 
              color: 'white', 
            }}
          />
          

          {/* Titolo e descrizione */}
          <Typography variant="h2" component="div">
            {titoloAbbreviato}
          </Typography>

          {/* Didascalia per la data dell'evento */}
          <span style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <Typography variant="body1Bold" sx={{marginTop: 1, }}>
            Data:
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', marginTop: 1 }}>
            {data ? new Date(data).toLocaleDateString() : 'Non disponibile'}
          </Typography>
          </span>
          

          {/* Didascalia per l'ora dell'evento */}
          <span style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <Typography variant="body1Bold" sx={{marginTop: 1, }}>
            Ora:
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', marginTop: 1 }}>
            {orario ? new Date('1970-01-01T' + orario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Non disponibile'}
          </Typography>
          </span>

          {/* Didascalia per la posizione dell'evento */}
          
          <span style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <Typography variant="body1Bold" sx={{marginTop: 1, }}>
            Posizione:
          </Typography>
          <Typography variant="body1" sx={{marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>
            {posizione || 'Non disponibile'}
          </Typography>
          </span>
          

        </CardContent>
      </CardActionArea>
    </Card>
    </ThemeProvider>
  );





}