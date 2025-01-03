"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import Link from 'next/link';
import { use } from 'react';
import BottoneIndietro from '@/app/components/IndietroButton';

export default function CarroDetailPage({ params }) {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  //const {idContenuto} = params;
  //const idArtigiano = params?.idArtigiano;
  const idContenuto = use(params).idContenuto;
  const [contenutoDetails, setContenutoDetails] = useState(null);

  useEffect(() => {
    if (!idContenuto) return;

    const fetchContenutoDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/contenuti?filters[idContenuto][$eq]=${idContenuto}&populate=Immagine`
        );
        const data = await response.json();

        if (data && data.data) {

          setContenutoDetails(data.data[0]);
          //console.log(data.data[0]);

        } else {
          console.warn("Nessun contenuto trovato per l'id fornito.");
        }
      } catch (error) {
        console.error("Errore nel recuperare i dati del conteuto:", error);
      }
    };

    fetchContenutoDetails();
  }, [idContenuto]);

  if (!contenutoDetails) {
    return <Typography>Caricamento...</Typography>;
  }

  const publicationDate = new Date(contenutoDetails.publishedAt);

  // Formattazione data in un formato leggibile
  const formattedDate = publicationDate.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' - ' + publicationDate.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Container>
      <BottoneIndietro destinazione="/storia" />

      {/* Immagine di copertura */}
      {contenutoDetails.Immagine &&
      <Box sx={{ width: '100%', height: '400px', mb: 4 }}>
        
          <img
            src={contenutoDetails.Immagine?.url ? 
              `${STRAPI_API_URL}${contenutoDetails.Immagine.url}`: 
              `https://placehold.co/600x400`}
            alt="Immagine di copertura"
            style={{
              width: '100%',
              height: '100%', // Imposta l'altezza dell'immagine per coprire l'area
              objectFit: 'cover', // Assicura che l'immagine riempia il contenitore senza distorsioni
              borderRadius: '8px',
            }}
          />
      </Box>
      }

      {/* Titolo del contenuto */}
      <Typography
        variant="h4"
        sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}
      >
        {contenutoDetails.titolo}
      </Typography>

      {/* Data di pubblicazione */}
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        Pubblicato il: {formattedDate}
      </Typography>

      {/* Testo del contenuto */}
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', lineHeight: 1.6 }}
      >
        {contenutoDetails.testo}
      </Typography>
    </Container>
  );


}

