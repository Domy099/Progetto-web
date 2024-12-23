import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

const PodioCard = ({ position, name, votes, image }) => {
  const truncatedName = name.length > 30 ? `${name.substring(0, 30)}...` : name;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // Cambia layout in base alla larghezza
        alignItems: "center",
        padding: 2,
        margin: 1,
        height: "auto", // Altezza dinamica
        maxHeight: "100%",
        maxWidth: "100%", // Larghezza massima
        borderRadius: "16px", // Bordi arrotondati
        boxShadow: 3, // Aggiungi ombra per un effetto più visibile
        backgroundColor: "#f5f5f5", // Colore di sfondo leggero
      }}
    >
      <Avatar
        src={image}
        alt={name}
        sx={{
          width: 80,
          height: 80,
          marginBottom: { xs: 2, sm: 0 }, // Aggiunge margine solo su schermi stretti
          marginRight: { sm: 2, xs: 0 }, // Sposta a destra solo su schermi ampi
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden", // Nasconde il testo in eccesso
          textAlign: "center", // Allinea il testo al centro per la versione mobile
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          sx={{
            whiteSpace: "nowrap", // Evita che il testo vada a capo
            overflow: "hidden", // Nasconde il testo in eccesso
            textOverflow: "ellipsis", // Aggiunge i puntini di sospensione
            width: "200px", // Imposta una larghezza massima per il testo
            maxWidth: "100%", // Limita la larghezza della card
            marginBottom: 1, // Spazio tra le righe
          }}
        >
          {`${position}° Posizione`}
        </Typography>

        <Typography
          variant="h5" // Aumenta la dimensione per enfatizzare il nome
          color="primary" // Colore principale per enfatizzare
          sx={{
            whiteSpace: "nowrap", // Evita che il testo vada a capo
            overflow: "hidden", // Nasconde il testo in eccesso
            textOverflow: "ellipsis", // Aggiunge i puntini di sospensione
            width: "200px", // Imposta una larghezza massima per il testo
            maxWidth: "100%", // Limita la larghezza della card
            marginBottom: 1, // Spazio tra le righe
            fontWeight: "bold", // Rende il testo più evidenziato
          }}
        >
          {truncatedName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap", // Evita che il testo vada a capo
            overflow: "hidden", // Nasconde il testo in eccesso
            textOverflow: "ellipsis", // Aggiunge i puntini di sospensione
            width: "200px", // Imposta una larghezza massima per il testo
            maxWidth: "100%", // Limita la larghezza della card
          }}
        >
          Voti: {votes}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PodioCard;
