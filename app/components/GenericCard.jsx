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
  
  const truncatedDescription = description && description.length > 100 ? description.slice(0, 100) + '...' : description;

  return (
    <Card sx={{ maxWidth: 345, position: 'relative', height: 400 }}>
      <CardActionArea>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative', height: '100%' }}>

          {/* CardMedia per la locandina */}
          <CardMedia
            component="img"
            image={image} // URL dell'immagine della locandina
            alt={altText} // Alt text per l'immagine
            sx={{
              width: '100%', // Assicura che l'immagine prenda tutta la larghezza disponibile
              height: 250, // Imposta l'altezza dell'immagine a 200px
              objectFit: 'cover', // Scala l'immagine per coprire l'intero rettangolo senza deformarsi
              borderRadius: '10px', // Arrotonda gli angoli dell'immagine
              marginBottom: 2, // Distanza tra l'immagine e il resto del contenuto
            }}
          />

          {/* Titolo e descrizione */}
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
            {truncatedDescription} {/* Usa un testo troncato se la descrizione è troppo lunga */}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

}