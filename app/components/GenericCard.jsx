"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';

export default function GenericCard(props) {
  const { title, description, image, altText, tipo } = props;
  const truncatedDescription = description.length > 100 ? description.slice(0, 100) + '...' : description;
  
  return (
    <Card sx={{ maxWidth: 345, position: 'relative' }}>
  <CardActionArea>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* CardMedia per la locandina */}
      <CardMedia
        component="img"
        image={image} // URL dell'immagine della locandina
        alt={altText} // Alt text per l'immagine
        sx={{
          width: '100%', // Assicura che l'immagine prenda tutta la larghezza disponibile
          height: 200, // Imposta l'altezza dell'immagine a 200px
          objectFit: 'cover', // Scala l'immagine per coprire l'intero rettangolo senza deformarsi
          borderRadius: '10px', // Arrotonda gli angoli dell'immagine
          marginBottom: 2, // Distanza tra l'immagine e il resto del contenuto
        }}
      />

      {/* Chip sopra il titolo 
      <Chip
        label={tipo}
        sx={{
          alignSelf: 'flex-start', // Posiziona il chip a sinistra
          backgroundColor: '#fdd835', // Colore giallo ocra
          color: 'white', // Colore del testo bianco
          marginBottom: 2, // Distanza dal titolo
          marginTop: 2, 
        }}
      />
      */}
      
      {/* Titolo e descrizione */}
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {truncatedDescription}
      </Typography>
    </CardContent>
  </CardActionArea>
</Card>

  );
  
  
  
  
  
}