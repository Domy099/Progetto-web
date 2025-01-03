"use client";
import React, { useEffect, useState } from 'react';
import CarriCard from '../components/CarriCard'; // Importa il componente ActionAreaCard
import { Container, Grid } from '@mui/material';
import Link from 'next/link';

import './carri.css';
import LeaderBoardVoti from '../components/LeaderBoardVoti';

const Page = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [carri, setCarri] = useState([]); // Stato per i dati dei carri

  // Effettua la chiamata all'API per ottenere i dati dei carri
  useEffect(() => {
    const fetchCarri = async () => {
      try {
        const response = await fetch(`${STRAPI_API_URL}/api/carri?populate[voti][count]=true&populate=immagine`); // Sostituisci con l'endpoint reale
        const jsonData = await response.json();
        console.log('Dati ricevuti:', jsonData);    
        setCarri(jsonData.data); // Accedi a jsonData.data per l'array corretto
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };
  
    fetchCarri();
  }, []);
  
  return (
    <>
    
    <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
    <LeaderBoardVoti carri={carri} />
    </Container>
    <Container style={{ paddingTop: '20px' }}>
      <Grid container spacing={4}>
        {carri.map((carro) => (
          <Grid item key={carro.idCarro} xs={12} sm={6} md={4}>
            <Link href={`/carri/${carro.idCarro}`} passHref>
              
              <CarriCard
                title={carro.nome}
                description={carro.descrizione}
                image={carro.immagine?.url ? `${STRAPI_API_URL}${carro.immagine.url}` : `https://placehold.co/600x400?text=${carro.nome}`}
                altText={`Immagine del carro ${carro.nome}`}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
    </>
  );
};

export default Page;
