"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box, Button } from '@mui/material';
import jwt from 'jsonwebtoken';

const CarroDetailPage = ({ params }) => {
  const { idCarro } = params; // Estrai idCarro da params
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true); // Stato iniziale a true se stai caricando i dati

  const [carroDetails, setCarroDetails] = useState(null);
  const oggi = new Date();
  const router = useRouter();

  useEffect(() => {
    if (!idCarro) return;

    const fetchCarroDetails = async () => {
      try {
        const response = await fetch(`https://strapiweb.duckdns.org/api/carri?filters[idCarro][$eq]=${idCarro}&populate=artigiani`);
        const data = await response.json();
        setCarroDetails(data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Errore nel recuperare i dati del carro', error);
        setLoading(false);
      }
    };

    fetchCarroDetails();
  }, [idCarro]);

  if (!carroDetails) {
    return <Typography>Caricamento...</Typography>;
  }

  const handleVotaClick = async () => {
    
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Utente non autenticato!");
      router.push("/login");
      return;
    }

    // ID UTENTE DAL TOKEN
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    console.log('ID utente:', userId);
    console.log(oggi);
    setLoading(true);

    try {
      // Prepara i dati del voto
      const votoData = {
        data: {
          carri: { id: idCarro },  // ID del carro votato (relazione con il modello "carro")
          votante: { id: userId }, // ID dell'utente che sta votando
          //creazione: oggi, // data del voto
        },
      };

      // Invia la richiesta POST per registrare il voto
      const response = await fetch("https://strapiweb.duckdns.org/api/voti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Aggiungi il token nell'intestazione
        },
        body: JSON.stringify(votoData),
      });

      if (!response.ok) {
        throw new Error("Errore nel registrare il voto");
      }

      const responseData = await response.json();
      console.log("Voto registrato con successo", responseData);

      // Imposta lo stato per mostrare che l'utente ha votato
      setVoted(true);
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }

    if (loading) {
      return <Typography>Caricamento in corso...</Typography>; // Mostra il messaggio di caricamento
    }
  };

  return (
      <>
        <Container>
          <Box 
            display="flex" 
            flexDirection={{ xs: "column", md: "row" }} 
            alignItems={{ xs: "center", md: "flex-start" }} 
            gap={4}
            mt={12} // Aggiungi margin-top per spostare i contenuti
          >
            {/* Immagine sulla sinistra */}
            <Box 
              flexShrink={0} 
              maxWidth={{ xs: "100%", md: "50%" }} 
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <img 
                src={carroDetails.urlFoto} 
                alt={`Foto del carro ${carroDetails.nome}`} 
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  maxHeight: "400px", 
                  objectFit: "cover", 
                  borderRadius: "8px" 
                }} 
              />
            </Box>
  
            {/* Informazioni sulla destra */}
            <Box flex={1}>
              <Typography variant="h4" component="h1" gutterBottom>
                {carroDetails.nome}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Descrizione:
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {carroDetails.descrizione}
              </Typography>
              {/* Bottone Vota */}
            
            </Box>
            
            
          </Box>
          <Button
        variant="contained"
        color="primary"
        onClick={handleVotaClick}
        sx={{ mt: 2 }} // Aggiungi un margine superiore se necessario
      >
        Vota
      </Button>
        </Container>
      
        <Container>
          <Typography variant="h6" gutterBottom>
            Artigiani:
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {carroDetails.artigiani.map((artigiano) => (
              <Card key={artigiano.idArtigiano} sx={{ maxWidth: "200px" }}>
                <CardContent>
                  <Typography variant="body2" component="p">
                    {artigiano.nome} {artigiano.cognome}
                  </Typography>

                  <Typography variant="body1" component="p">
                    Storia dell'artigiano:
                  </Typography>
                  <Typography variant="body2" component="p">
                    {artigiano.storia}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </>
    );
};

export default CarroDetailPage;
