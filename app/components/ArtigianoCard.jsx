import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const ArtigianoCard = ({ nome, cognome, storia, immagine }) => {
    const storiaAbbreviata = storia.length > 100 ? storia.substring(0, 100) + "..." : storia;
    return (
        <Card
        sx={{
          display: "flex",
          height: 160, // Altezza specifica
          alignItems: "stretch", // Allinea gli elementi all'interno della card
          minWidth: "300px", // Larghezza minima
          maxWidth: "100%", // Occupa tutto lo spazio disponibile nella griglia
          flexGrow: 1, // Adatta la card allo spazio disponibile
          borderRadius: 2, // Arrotonda gli angoli
          boxShadow: 3, // Aggiunge un'ombra per migliorare l'estetica
          overflow: "hidden", // Impedisce al contenuto di fuoriuscire dalla card
        }}
      >
        <CardMedia
          component="img"
          sx={{
            flexShrink: 0,
            width: "40%", // Mantiene una proporzione costante rispetto alla card
            maxWidth: "40%",
            height: "100%", // Adatta l'altezza all'altezza della card
            objectFit: "cover", // Garantisce che l'immagine riempia lo spazio
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
            justifyContent: "space-between", // Spaziatura verticale bilanciata
            padding: 2,
            flexGrow: 1, // Consente al contenuto di espandersi
            overflow: "hidden", // Assicura che non ci siano fuoriuscite
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              marginBottom: 1,
              fontWeight: "regular", // Rende più evidente il nome dell'artigiano
              whiteSpace: "nowrap", // Evita che il nome vada su più righe
              overflow: "hidden", // Impedisce fuoriuscite
              textOverflow: "ellipsis", // Mostra i tre puntini se il testo è troppo lungo
            }}
          >
            {nome} {cognome}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
            Storia dell'artigiano:
          </Typography>
          <Typography
            variant="body2"
            component="p"
            sx={{
              display: "-webkit-box", // Permette un overflow controllato del testo
              WebkitLineClamp: 3, // Mostra un massimo di 3 righe
              WebkitBoxOrient: "vertical",
              overflow: "hidden", // Impedisce fuoriuscite
              textOverflow: "ellipsis", // Mostra tre puntini per il testo tagliato
            }}
          >
            {storiaAbbreviata}
          </Typography>
        </CardContent>
      </Card>
      
  );
};

export default ArtigianoCard;
