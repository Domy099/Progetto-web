"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import Link from 'next/link';

export default function CarroDetailPage ({ params }){
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const {idArtigiano} = params;
    //const idArtigiano = params?.idArtigiano;
    console.log(idArtigiano);
  const [artigianoDetails, setArtigianoDetails] = useState(null);

  useEffect(() => {
    if (!idArtigiano) return;

    const fetchArtigianoDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/artigiani?filters[idArtigiano][$eq]=${idArtigiano}&populate=carri`
        );
        const data = await response.json();

        if (data && data.data) {

          setArtigianoDetails(data.data[0]);
          console.log(data.data[0]);

        } else {
          console.warn("Nessun artigiano trovato per l'id fornito.");
        }
      } catch (error) {
        console.error("Errore nel recuperare i dati dell'artigiano:", error);
      }
    };

    fetchArtigianoDetails();
  }, [idArtigiano]);

  if (!artigianoDetails) {
    return <Typography>Caricamento...</Typography>;
  }

  return (
    <Container>
      {/* Titolo dell'artigiano */}
      <Typography variant="h5" sx={{ color: 'text.secondary' }}>
        {artigianoDetails.nome} {artigianoDetails.cognome}
      </Typography>
  
      <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
        Descrizione:
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {artigianoDetails.storia} {/* Descrizione dell'artigiano */}
      </Typography>
  
      <Typography variant="h6" sx={{ color: 'text.secondary' }}>
        Carri:
      </Typography>

      {artigianoDetails && artigianoDetails.carri ? (
        <Box mt={4}>
          {/*Il carro può essere solo uno al momento, se ce ne saranno di piu va modificato con una mappa */}
        <Link href={`/carri/${artigianoDetails.carri.idCarro}`}>
        <Card key={artigianoDetails.carri.idCarro} sx={{ display: 'flex', width: '600px', height: 160}}>
          <CardMedia
            component="img"
            sx={{
              flexShrink: 0, // Impedisce che l'immagine si restringa troppo
              width: 'auto', // Imposta la larghezza dell'immagine in modo che si adatti al contenitore
              maxWidth: '100%', // Impedisce che l'immagine superi la larghezza del contenitore
              height: 'auto', // Imposta l'altezza per mantenere le proporzioni
              objectFit: 'cover', // Assicura che l'immagine riempia l'area senza distorsioni
            }}
            image={artigianoDetails.carri.urlFoto}
            alt={`Immagine del carro ${artigianoDetails.carri.nome}`}
          />
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              {artigianoDetails.carri.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {artigianoDetails.carri.descrizione}
            </Typography>
          </CardContent>
        </Card>
        </Link>
      </Box>
      
      ) : (
        <Typography variant="body1" color="text.secondary">
          Nessun carro disponibile.
        </Typography>
      )}


    </Container>
  );
} 

