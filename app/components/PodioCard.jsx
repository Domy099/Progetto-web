import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

const PodioCard = ({ position, name, votes, image }) => {

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
        margin: 1,
        height: "auto", 
        maxHeight: "100%",
        width: "45%",
        minWidth: "300px",
        maxWidth: "60%",
        borderRadius: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Avatar
        src={image}
        alt={name}
        sx={{
          width: 100,
          height: 100,
          marginBottom: { xs: 2, sm: 0 }, // Aggiunge margine solo su schermi stretti
          marginRight: { sm: 2, xs: 0 }, // Sposta a destra solo su schermi ampi
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          textAlign: "left", 
          
        }}
      >
        <Typography
          variant="body1Bold"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "200px",
            maxWidth: "100%", 
            marginBottom: 1, 
          }}
        >
          {`${position}° Posizione`}
        </Typography>

        <Typography
          variant="h3"
          color={"#408eb5"}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden", 
            textOverflow: "ellipsis",
            width: "200px", 
            maxWidth: "100%", 
            marginBottom: 1,
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden", 
            textOverflow: "ellipsis",
            width: "200px",
            maxWidth: "100%", 
          }}
        >
          Voti: {votes}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PodioCard;
