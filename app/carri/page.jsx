"use client";
import React, { useEffect, useState } from 'react';
import ActionAreaCard from '../components/ActionAreaCard'; // Importa il componente ActionAreaCard
import { Container, Grid } from '@mui/material';
import Link from 'next/link';

import './carri.css';

const Page = () => {
  const [carri, setCarri] = useState([]); // Stato per i dati dei carri

  // Effettua la chiamata all'API per ottenere i dati dei carri
  useEffect(() => {
    const fetchCarri = async () => {
      try {
        const response = await fetch('https://strapiweb.duckdns.org/api/carri'); // Sostituisci con l'endpoint reale
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
    <Container style={{ paddingTop: '20px' }}>
      <Grid container spacing={4}>
        {carri.map((carro) => (
          <Grid item key={carro.idCarro} xs={12} sm={6} md={4}>
            <Link href={`/carri/${carro.idCarro}`} passHref>
              
              <ActionAreaCard
                title={carro.nome}
                description={carro.descrizione}
                image={carro.urlFoto}
                altText={`Immagine del carro ${carro.nome}`}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Page;
