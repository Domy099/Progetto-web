"use client";
import React from "react";
import { useState } from "react";
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import PodioCard from "./PodioCard";

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const LeaderBoardVoti = ({ carri }) => {
    // Ordiniamo i carri in base ai voti e prendiamo i primi 3

    const formattedData = carri.map(carro => ({
        id: carro.id,
        name: carro.nome,
        votes: carro.voti?.count || 0,
        image: carro.urlFoto
            ? carro.urlFoto
            : `https://placehold.co/150?text=${carro.nome}`
    }));

    const topCarri = ([...formattedData].sort((a, b) => b.votes - a.votes).slice(0, 3));

    const [currentPosition, setCurrentPosition] = useState(0);

    const handleNext = () => {
        setCurrentPosition((prevPosition) => (prevPosition + 1) % topCarri.length);
    };

    const handlePrev = () => {
        setCurrentPosition((prevPosition) => (prevPosition - 1 + topCarri.length) % topCarri.length);
    };


    return (
        <Box sx={{ maxWidth: "80%", padding: 2, margin: "auto" }}>
          <Carousel
            index={currentPosition} // Imposta la posizione corrente
            onChange={(newIndex) => setCurrentPosition(newIndex)} // Gestisce il cambio di posizione
            navButtonsAlwaysVisible
            indicators={false}
            autoPlay={true} // Se non vuoi che si muova automaticamente
            timeout={10000} 
            sx={{
              overflow: "hidden",
              width: "100%", // Assicura che il carosello prenda tutta la larghezza disponibile
              position: "relative", // Posizione relativa per il carosello
            }}
          >
            {topCarri.map((carro, index) => (
              <Box key={carro.id} sx={{ display: "flex", justifyContent: "center" }}>
                <PodioCard
                  position={index + 1}
                  name={carro.name}
                  votes={carro.votes}
                  image={carro.image}
                />
              </Box>
            ))}
          </Carousel>
        </Box>
      );
      


};

export default LeaderBoardVoti;
