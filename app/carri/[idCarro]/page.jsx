"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box, Button } from '@mui/material';
import jwt from 'jsonwebtoken';

export default function CarroDetailPage ({ params }){
    
  const {idCarro} = params;

  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true); // Stato iniziale a true se stai caricando i dati

  const [carroDetails, setCarroDetails] = useState(null);
  const oggi = new Date();
  const router = useRouter();

  const [idUtente, setIdUtente] = useState(null);

  // FETCH DATI DEL CARRO
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

  // FETCH DATI DEI VOTI PER VERIFICARE SE L'UTENTE HA GIA' VOTATO
  useEffect(() => {
    const fetchVoti = async () => {
      try {
        // Recupera il token dell'utente dal sessionStorage
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error("Utente non autenticato!");
          alert("Devi effettuare l'accesso per votare");
          router.push("/login");
          return;
        }

        // Decodifica il token per ottenere l'ID dell'utente
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) {
          console.error("Token non valido o ID utente non presente!");
          alert("Errore durante l'autenticazione, accedi nuovamente.");
          router.push("/login");
          return;
        }

        const idUtente = decoded.id;
        setIdUtente(idUtente);
        console.log('ID utente:', idUtente);

        // Imposta lo stato di caricamento
        setLoading(true);

        // Esegui la chiamata API con il token incluso nei headers
        const response = await fetch(`https://strapiweb.duckdns.org/api/voti?filters[votante][$eq]=${idUtente}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include il token
            'Content-Type': 'application/json', // Specifica il tipo di contenuto
          },
        });

        if (!response.ok) {
          throw new Error('Errore nella risposta della API');
        }

        // Ottieni i dati dei voti
        const voti = await response.json();

        // Controlla se l'utente ha già votato
        const hasVoted = voti.data && voti.data.length > 0;
        setHasVoted(hasVoted);
        setVotiDetails(hasVoted ? voti.data[0] : null); // Se ha votato, salva i dettagli del voto
        console.log('Dati dei voti:', voti);
        console.log('Votato:', hasVoted);

        setLoading(false);
      } catch (error) {
        console.error('Errore nel recuperare i dati dei voti:', error);
        setLoading(false);
      }
    };

    fetchVoti();
  }, []); // Renderizza il voto al caricamento della pagina (senza entrare in eventuali loop)


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

    if (hasVoted) {
      alert("Hai già votato per un carro");
      return;
    }

    // Se è autenticato, ottieni il suo id dal token tramite 
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    setIdUtente(userId);
    console.log('ID utente per il voto:', idUtente);
    setLoading(true);

    try {
      // Prepara i dati del voto
      const votoData = {
        data: {
          carri: { id: idCarro },  // ID del carro votato
          votante: { id: idUtente }, // ID dell'utente che sta votando
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
      setHasVoted(true);
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
          {carroDetails.artigiani.length > 0 ? (
            carroDetails.artigiani.map((artigiano) => (
              <Card key={artigiano.idArtigiano} sx={{ display: 'flex', width: '600px', height: 160}}>
                <CardMedia
                  component="img"
                  sx={{
                    flexShrink: 0, // Impedisce che l'immagine si restringa troppo
                    width: 'auto', // Imposta la larghezza dell'immagine in modo che si adatti al contenitore
                    maxWidth: '100%', // Impedisce che l'immagine superi la larghezza del contenitore
                    height: 'auto', // Imposta l'altezza per mantenere le proporzioni
                    objectFit: 'cover', // Assicura che l'immagine riempia l'area senza distorsioni
                  }}
                  image={'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'}
                />

                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 2 }}>
                  <Typography variant="h6" component="p" sx={{ marginBottom: 1 }}>
                    {artigiano.nome} {artigiano.cognome}
                  </Typography>

                  <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
                    Storia dell'artigiano:
                  </Typography>
                  <Typography variant="body2" component="p">
                    {artigiano.storia}
                  </Typography>
                </CardContent>
              </Card>

            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nessuna informazione sugli artigiani.
            </Typography>
          )}
        </Box>
        </Container>
      </>
    );
};


