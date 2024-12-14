"use client";
import React, { useEffect, useState } from 'react';
import ActionAreaCard from '../components/ActionAreaCard'; // Importa il componente ActionAreaCard
import { Container, Grid } from '@mui/material';
import Link from 'next/link';

import './artigiani.css';

const Page = () => {
  const [artigiani, setArtigiani] = useState([]); // Stato per i dati degli artigiani

  // Effettua la chiamata all'API per ottenere i dati degli artigiani
  useEffect(() => {
    const fetchArtigiani = async () => {
      try {
        const response = await fetch('https://strapiweb.duckdns.org/api/artigiani?populate=*'); // Sostituisci con l'endpoint reale
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
      <Grid container spacing={4}>
        {artigiani.map((artigiano) => (
          <Grid item key={artigiano.idArtigiano} xs={12} sm={6} md={4}>
            <Link href={`/artigiani/${artigiano.idArtigiano}`} passHref>
               <ActionAreaCard
                title={artigiano.nome}
                description={artigiano.storia}
                image={'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'}
                altText={`Immagine dell'artigiano ${artigiano.nome}`}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Page;
