"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import PodioCard from "./PodioCard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const LeaderBoardVoti = ({ carri }) => {
    const formattedData = carri.map(carro => ({
        id: carro.id,
        name: carro.nome,
        votes: carro.voti?.count || 0,
        image: carro.immagine?.url ? `${STRAPI_API_URL}${carro.immagine.url}` : `https://placehold.co/600x400?text=${carro.nome}`
    }));

    const topCarri = ([...formattedData].sort((a, b) => b.votes - a.votes).slice(0, 3));

    // Duplichiamo gli elementi per creare l'effetto di loop infinito
    const caroselloItems = [...topCarri, ...topCarri, ...topCarri];

    const currentIndexRef = useRef(topCarri.length); // Partiamo dal primo elemento "reale"
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        currentIndexRef.current += 1;
        updateCarosello();
    };

    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        currentIndexRef.current -= 1;
        updateCarosello();
    };

    const updateCarosello = () => {
        const carosello = document.getElementById("carosello");
        if (carosello) {
            const offset = -currentIndexRef.current * 100; // 100% per ogni slide
            carosello.style.transition = "transform 0.5s ease-in-out";
            carosello.style.transform = `translateX(${offset}%)`;
        }
    };

    // Effetto per gestire il reset del carosello
    useEffect(() => {
        const carosello = document.getElementById("carosello");
        const handleTransitionEnd = () => {
            setIsTransitioning(false);

            // Se siamo alla fine della lista duplicata, torniamo alla posizione "reale"
            if (currentIndexRef.current >= topCarri.length * 2) {
                currentIndexRef.current = topCarri.length;
                carosello.style.transition = "none";
                carosello.style.transform = `translateX(${-currentIndexRef.current * 100}%)`;
            }

            // Se siamo all'inizio della lista duplicata, torniamo alla posizione "reale"
            if (currentIndexRef.current < topCarri.length) {
                currentIndexRef.current = topCarri.length;
                carosello.style.transition = "none";
                carosello.style.transform = `translateX(${-currentIndexRef.current * 100}%)`;
            }
        };

        carosello.addEventListener("transitionend", handleTransitionEnd);
        return () => carosello.removeEventListener("transitionend", handleTransitionEnd);
    }, [topCarri.length]);

    return (
        <Box sx={{ width: "100%", overflow: "hidden", position: "relative" }}>
            {/* Container del carosello */}
            <Box
                id="carosello"
                sx={{
                    display: "flex",
                }}
            >
                {caroselloItems.map((carro, index) => (
                    <Box
                        key={`${carro.id}-${index}`}
                        sx={{
                            flex: "0 0 100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <PodioCard
                            position={(index % topCarri.length) + 1}
                            name={carro.name}
                            votes={carro.votes}
                            image={carro.image}
                        />
                    </Box>
                ))}
            </Box>

            {/* Pulsanti di navigazione */}
            <IconButton
                onClick={handlePrev}
                sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                }}
            >
                <ArrowBackIosIcon />
            </IconButton>
            <IconButton
                onClick={handleNext}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                }}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};

export default LeaderBoardVoti;