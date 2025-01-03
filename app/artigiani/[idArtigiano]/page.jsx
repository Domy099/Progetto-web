"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import Link from 'next/link';
import BottoneIndietro from '@/app/components/IndietroButton';
import CarriCard from '@/app/components/CarriCard';

export default function CarroDetailPage ({ params }){
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const idArtigiano = use(params).idArtigiano;
    //const idArtigiano = params?.idArtigiano;
    console.log(idArtigiano);
  const [artigianoDetails, setArtigianoDetails] = useState(null);

  useEffect(() => {
    if (!idArtigiano) return;

    const fetchArtigianoDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/artigiani?filters[idArtigiano][$eq]=${idArtigiano}&populate[0]=immagine&populate[1]=carri.immagine`
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
      <BottoneIndietro destinazione="/artigiani" />
  
      {/* Dettagli dell'artigiano */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }} // Cambia da una colonna a due colonne
        alignItems="flex-start"
        gap={4}
        mt={2}
      >
        {/* Immagine dell'artigiano a sinistra (se disponibile) */}
        <Box
          flexShrink={0}
          sx={{
            maxWidth: { xs: "100%", sm: "40%" }, // Larghezza dinamica per immagine
          }}
        >
          <img
            src={`${STRAPI_API_URL}${artigianoDetails.immagine.url}`|| 'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'}
            alt={`Foto di ${artigianoDetails.nome} ${artigianoDetails.cognome}`}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>
  
        {/* Dettagli del nome, cognome e descrizione */}
        <Box flex={1}>
          <Typography variant="h4" component="h1" gutterBottom color="text.secondary">
            {artigianoDetails.nome} {artigianoDetails.cognome}
          </Typography>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Descrizione:
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {artigianoDetails.storia}
          </Typography>
        </Box>
      </Box>
  
      {/* Sezione Carri */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Carri:
        </Typography>
  
        {artigianoDetails && artigianoDetails.carri ? (
          <Box mt={4}>
            <Link href={`/carri/${artigianoDetails.carri.idCarro}`}>
              <CarriCard 
              title={artigianoDetails.carri.nome}
              description={artigianoDetails.carri.descrizione}
              image={artigianoDetails.carri.immagine?.url ? `${STRAPI_API_URL}${artigianoDetails.carri.immagine.url}` :`https://placehold.co/150?text=${artigianoDetails.carri.nome}`}
              altText={`Immagine del carro ${artigianoDetails.carri.nome}`}
              />
            </Link>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Nessun carro disponibile.
          </Typography>
        )}
      </Container>
    </Container>
  );
} 

