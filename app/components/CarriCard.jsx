"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function CarriCard(props) {
  const { title, description, image, altText } = props;

  return (
    <Card sx={{ minWidth: 270, maxWidth: 345, height: '100%', position: 'relative', borderRadius: '20px' }}>
      <CardActionArea>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <CardMedia
            component="img"
            image={image}
            alt={altText}
            sx={{
              borderRadius: '10px',
              width: '100%',
              height: 200,
              objectFit: 'cover',
            }}
          />
          <Typography variant="h2" marginTop={2} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </Typography>
          <Typography variant="body2" marginTop={1} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

  );
}