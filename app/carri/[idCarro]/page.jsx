"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';

const CarroDetailPage = ({ params }) => {
  const { idCarro } = params; // Estrai idCarro da params

  const [carroDetails, setCarroDetails] = useState(null);

  useEffect(() => {
    if (!idCarro) return;

    const fetchCarroDetails = async () => {
      try {
        const response = await fetch(`https://strapiweb.duckdns.org/api/carri?filters[idCarro][$eq]=${idCarro}`);
        const data = await response.json();
        setCarroDetails(data.data[0]);
      } catch (error) {
        console.error('Errore nel recuperare i dati del carro', error);
      }
    };

    fetchCarroDetails();
  }, [idCarro]);

  if (!carroDetails) {
    return <Typography>Caricamento...</Typography>;
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {carroDetails.nome}
        </Typography>
        <Card sx={{ maxWidth: 600 }}>
          <CardMedia
            component="img"
            height="400"
            image={carroDetails.urlFoto}
            alt={`Foto del carro ${carroDetails.nome}`}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Descrizione:
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {carroDetails.descrizione}
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Pubblicato il: {new Date(carroDetails.publishedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CarroDetailPage;
