import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const FeedbackCard = ({ nomeEvento, descrizioneFeedback }) => {
  return (
    <Card
      sx={{
        maxWidth: 345, // dimensione fissa della card
        height: 150, // altezza fissa della card
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Evento: {nomeEvento}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#424242",
            marginTop: 1,
            overflow: "hidden", // Nasconde il testo che va oltre
            display: "-webkit-box",
            WebkitLineClamp: 3, // Imposta il numero massimo di righe visibili
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis", // Troncamento del testo
          }}
        >
          Cosa ne pensi: {descrizioneFeedback}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
