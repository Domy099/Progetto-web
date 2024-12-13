"use client";
import React, { useEffect, useState } from 'react';
import ActionAreaCard from '../components/ActionAreaCard'; // Importa il componente ActionAreaCard
import { Container, Grid } from '@mui/material';
import Link from 'next/link';

const Page = () => {
  const [eventi, setEventi] = useState([]); // Stato per i dati dei carri

  // Effettua la chiamata all'API per ottenere i dati dei carri
  useEffect(() => {
    const fetchEventi = async () => {
      try {
        const response = await fetch('https://strapiweb.duckdns.org/api/eventi'); // Sostituisci con l'endpoint reale
        const jsonData = await response.json();
        console.log('Dati ricevuti:', jsonData);
        setEventi(jsonData.data); // Accedi a jsonData.data per l'array corretto
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };
  
    fetchEventi();
  }, []);
  
  return (
    <Container>
      <Grid container spacing={4}>
        {eventi.map((evento) => (
          <Grid item key={evento.matricola} xs={12} sm={6} md={4}>
            <Link href={`/eventi/${evento.matricola}`} passHref>
              <ActionAreaCard
                title={evento.nome}
                description={evento.Descrizione}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Page;
