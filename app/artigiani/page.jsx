"use client";
import React, { useEffect, useState } from 'react';
import ActionAreaCard from '../components/GenericCard'; // Importa il componente ActionAreaCard
import { Container, Grid } from '@mui/material';
import Link from 'next/link';
import Typography from '@mui/material/Typography';

//import './artigiani.css';

const Page = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  const [artigiani, setArtigiani] = useState([]); // Stato per i dati degli artigiani

  // Effettua la chiamata all'API per ottenere i dati degli artigiani
  useEffect(() => {
    const fetchArtigiani = async () => {
      try {
        const response = await fetch(`${STRAPI_API_URL}/api/artigiani?populate=*`); // Sostituisci con l'endpoint reale
        const jsonData = await response.json();
        console.log('Dati ricevuti:', jsonData);
        setArtigiani(jsonData.data); // Accedi a jsonData.data per l'array corretto
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };
  
    fetchArtigiani();
  }, []);
  
  return (
    <Container style={{ paddingTop: '20px' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        color="text.secondary" 
        sx={{ marginBottom: 4 }} // Aggiunge più spazio tra il titolo e le card
      > 
        I creatori della magia
      </Typography>
      <Grid container spacing={4}>
        {artigiani.map((artigiano) => (
          <Grid item key={artigiano.idArtigiano} xs={12} sm={6} md={4}>
            <Link href={`/artigiani/${artigiano.idArtigiano}`} passHref>
              <ActionAreaCard
                title={artigiano.nome}
                description={artigiano.storia}
                image={artigiano.immagine?.url ? `${STRAPI_API_URL}${artigiano.immagine.url}` :'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'}
                altText={`Immagine dell'artigiano ${artigiano.nome}`}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
  
}  

export default Page;
