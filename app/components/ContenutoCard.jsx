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
    <Card sx={{ minWidth: 270, maxWidth: 345, position: 'relative', borderRadius: '20px' }}>
      <CardActionArea>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {image && (
            <CardMedia
              component="img"
              height="140"
              image={image}
              alt={altText}
              sx={{
                borderRadius: '10px',
                width: '100%',
                height: 150,
                objectFit: 'cover',
              }}
            />
          )}

          {data && (
            <Chip
              label={new Date(data).toLocaleDateString('it-IT')}
              sx={{
                alignSelf: 'flex-start',
                backgroundColor: '#fdd835',
                marginBottom: 2,
                marginTop: 2,
                typography: 'label',
                color: 'white',
              }}
            />
          )}

          <Typography variant="h2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
