"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';

export default function ContenutoCard(props) {
  const { title, image, altText, data } = props;

  return (
    <Card sx={{ width: 345, height: 350, position: 'relative', borderRadius: '10px' }}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative', height: '100%' }}>
          {/* CardMedia per la locandina */}
          {image && (
            <CardMedia
              component="img"
              height="140" // Imposta l'altezza dell'immagine
              image={image} // URL dell'immagine della locandina
              alt={altText} // Alt text per l'immagine
              sx={{
                borderRadius: '10px', // Arrotonda gli angoli dell'immagine
                width: '100%', // Assicura che l'immagine prenda tutta la larghezza disponibile
                height: 140, // Imposta l'altezza dell'immagine
                objectFit: 'cover', // Scala l'immagine per coprire l'intero rettangolo senza deformarsi
              }}
            />
          )}

          {/* Chip sopra il titolo */}
          {data && (
            <Chip
              label={new Date(data).toLocaleDateString('it-IT')}
              sx={{
                alignSelf: 'flex-start', // Posiziona il chip a sinistra
                backgroundColor: '#fdd835', // Colore giallo ocra
                color: 'white', // Colore del testo bianco
                marginBottom: 2, // Distanza dal titolo
                marginTop: 2,
              }}
            />
          )}

          {/* Titolo e descrizione */}
          <Typography gutterBottom variant="h5" component="div" 
          sx={{
            flexGrow: 0,
            overflow: 'hidden', // Nasconde il testo che eccede
            textOverflow: 'ellipsis', // Aggiunge i puntini di sospensione
            
          }}>
            {title}
          </Typography>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
