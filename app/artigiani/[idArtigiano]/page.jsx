"use client";

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Link from 'next/link';
import BottoneIndietro from '@/app/components/IndietroButton';
import CarriCard from '@/app/components/CarriCard';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/public/theme';
import LeggiDiPiu from '@/app/components/LeggiDiPiu';
import LoadingCircle from '@/app/components/LoadingCircle';

export default function ArtigianoDetailPage ({ params }){
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const idArtigiano = use(params).idArtigiano;
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
    return (<LoadingCircle />);
    
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Container>
      <BottoneIndietro destinazione="/artigiani" />
  
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="flex-start"
        gap={4}
        mt={2}
      >
        <Box
          flexShrink={0}
          sx={{
            maxWidth: { xs: "100%", sm: "40%" },
          }}
        >
          <img
            src={artigianoDetails.immagine?.url ? `${STRAPI_API_URL}${artigianoDetails.immagine.url}` : 'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'}
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
  
        <Box flex={1}>
          <Typography variant="h1" component="h1">
            {artigianoDetails.nome} {artigianoDetails.cognome}
          </Typography>
          <Typography variant="h2" marginTop={2} >
          Descrizione:
        </Typography>
          {artigianoDetails.storia ? (<LeggiDiPiu text= {artigianoDetails.storia} lunghezza={450} />)
          : (<Typography variant="body2" color="text.secondary">Nessuna descrizione disponibile.</Typography>)
          }
        </Box>
      </Box>
      
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h2" sx={{ marginTop: 3, marginBottom: 2 }}>
          Cosa ha realizzato:
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
          <Typography variant="body2" color="text.secondary">
            Nessun carro disponibile.
          </Typography>
        )}
      </Container>
    </Container>
    </ThemeProvider>
  );
} 

