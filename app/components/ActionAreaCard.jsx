
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function ActionAreaCard(props) {
  const { title, description, image, altText } = props;
  const truncatedDescription = description.length > 100 ? description.slice(0, 100) + '...' : description;
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="100"
          image= {image}
          alt= {altText}
          sx={{
            objectFit: 'cover',    // Adatta l'immagine senza distorsioni
            objectPosition: 'center'  // Centra l'immagine
          }}
        />
        <CardContent>
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