"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';

const EventoDetailPage = ({ params }) => {
  const matricola = params?.matricola;

  const [eventoDetails, setEventoDetails] = useState(null);

  useEffect(() => {
    if (!matricola) return;

    const fetchEventoDetails = async () => {
      try {
        const response = await fetch(
          `https://strapiweb.duckdns.org/api/eventi?filters[matricola][$eq]=${matricola}&populate=pois`
        );
        const data = await response.json();

        if (data?.data?.length > 0) {
          setEventoDetails(data.data[0]);
        } else {
          console.warn("Nessun evento trovato per la matricola fornita.");
        }
      } catch (error) {
        console.error("Errore nel recuperare i dati dell'evento:", error);
      }
    };

    fetchEventoDetails();
  }, [matricola]);

  if (!eventoDetails) {
    return <Typography>Caricamento...</Typography>;
  }

  return (
    <Container>
      {/* Titolo dell'evento */}
      <Typography variant="h4" component="h1" gutterBottom>
        {eventoDetails.nome}
      </Typography>
  
      <Typography variant="h6" gutterBottom>
        Descrizione:
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {eventoDetails.Descrizione} {/* Descrizione dell'evento */}
      </Typography>
  
      <Typography variant="body2" color="text.secondary"></Typography>
      <Typography variant="body2" color="text.secondary">
        Data: {new Date(eventoDetails.data).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Tipo: {eventoDetails.tipo}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Posizione: {eventoDetails.posizione || 'Non specificata'}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Punti di Interesse dell'evento:
      </Typography>
  
      {eventoDetails && eventoDetails.pois && eventoDetails.pois.length > 0 ? (
        <Box mt={4}>
          {eventoDetails.pois.map((poi) => (
            <Card key={poi.idPOI} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{poi.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {poi.descrizione}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Nessun punto di interesse disponibile.
        </Typography>
      )}
    </Container>
  );
} 

export default EventoDetailPage;
