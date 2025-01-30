import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const ArtigianoCard = ({ nome, cognome, storia, immagine }) => {
  return (
    <Card
      sx={{ minWidth: 270, maxWidth: 345, position: 'relative', borderRadius: '20px' }}
    >
      <CardMedia
        component="img"
        sx={{
          flexShrink: 0,
          width: "40%",
          maxWidth: "40%",
          height: 100,
          objectFit: "cover",
          borderEndEndRadius: 20,
          borderTopRightRadius: 20,
        }}
        image={
          immagine
        }
        alt={`Immagine di ${nome} ${cognome}`}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 2,
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body1Bold"
          component="h3"
          sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}
        >
          {nome} {cognome}
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: "text.seconary", textAlign: "left", fontSize: "0.8rem" }}>
          Scopri di più
        </Typography>
      </CardContent>
    </Card>

  );
};

export default ArtigianoCard;
