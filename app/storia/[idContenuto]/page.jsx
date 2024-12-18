"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import Link from 'next/link';
import { use } from 'react';

export default function CarroDetailPage ({ params }){
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_POI_API_URL;
  //const {idContenuto} = params;
    //const idArtigiano = params?.idArtigiano;
  const idContenuto = use(params).idContenuto;
    console.log(idContenuto);
  const [contenutoDetails, setContenutoDetails] = useState(null);

  useEffect(() => {
    if (!idContenuto) return;

    const fetchContenutoDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/contenuti?filters[idContenuto][$eq]=${idContenuto}`
        );
        const data = await response.json();

        if (data && data.data) {

          setContenutoDetails(data.data[0]);
          
          console.log(data.data[0]);

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

  const publicationDate = new Date(contenutoDetails.createdAt);
  
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
      {/* Titolo del contenuto */}
      <Typography variant="h5" sx={{ color: 'text.secondary' }}>
        {contenutoDetails.titolo}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 1 }}>
        Pubblicato il: {formattedDate}
      </Typography>
  
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {contenutoDetails.testo} {/* Testo del contenuto */}
      </Typography>
     
    </Container>
  );
} 

