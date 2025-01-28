"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function GenericCard(props) {
  const { nome, cognome, storia, immagine, altText, } = props;

  return (
    <Card sx={{ minWidth:250, maxWidth: 345, height:'100%', position: 'relative', borderRadius: '20px'}}>
      <CardActionArea> 
        <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative', height: '100%' }}>
          {/* CardMedia per la locandina */}
          <CardMedia
            component="img"
            image={immagine}
            alt={altText}
            sx={{
              borderRadius: '10px', 
              width: '100%', 
              height: 250, 
              objectFit: 'cover',
            }}
          />

          {/* Titolo e descrizione */}
          <Typography variant="h2" component="h2" marginTop={2}>
            {nome} {cognome}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {storia}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

}