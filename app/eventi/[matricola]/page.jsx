"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';

const EventoDetailPage = ({ params }) => {
  const { matricola } = params; // Estrai idCarro da params

  const [eventoDetails, setEventoDetails] = useState(null);

  useEffect(() => {
    if (!matricola) return;

    const fetchEventoDetails = async () => {
      try {
        const response = await fetch(`https://strapiweb.duckdns.org/api/eventi?filters[matricola][$eq]=${matricola}`);
        const data = await response.json();
        setEventoDetails(data.data[0]);
      } catch (error) {
        console.error('Errore nel recuperare i dati del carro', error);
      }
    };

    fetchEventoDetails();
  }, [matricola]);

  if (!eventoDetails) {
    return <Typography>Caricamento...</Typography>;
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
        {/* Titolo dell'evento */}
        <Typography variant="h4" component="h1" gutterBottom>
          {eventoDetails.nome}
        </Typography>

        {/* Card dell'evento */}
        <Card sx={{ maxWidth: 600 }}>
          <CardMedia
            component="img"
            height="400"
            image={eventoDetails.urlFoto}  // Foto dell'evento
            alt={`Foto dell'evento ${eventoDetails.nome}`}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent>
            {/* Descrizione dell'evento */}
            <Typography variant="h6" gutterBottom>
              Descrizione:
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {eventoDetails.Descrizione}  {/* Descrizione dell'evento */}
            </Typography>

            {/* Altri dettagli */}
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Data: {new Date(eventoDetails.data).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipo: {eventoDetails.tipo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pubblicato il: {new Date(eventoDetails.publishedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );

}

export default EventoDetailPage;
