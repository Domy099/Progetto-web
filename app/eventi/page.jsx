"use client";
import React, { useEffect, useState } from 'react';
import ActionAreaCard from '../components/ActionAreaCard'; // Importa il componente ActionAreaCard
import CarnivaleParadeMenus from '../components/Menu';
import { Container, Grid } from '@mui/material';
import Link from 'next/link';

const Page = () => {
  const [eventi, setEventi] = useState([]); // Stato per i dati dei carri
  const [sfilataSelezionata, setSfilataSelezionata] = useState(1);
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_POI_API_URL;
  // Effettua la chiamata all'API per ottenere i dati dei carri
  useEffect(() => {
    const fetchEventi = async () => {
      try {
        const response = await fetch(`${STRAPI_API_URL}/api/eventi?filters[sfilata][$eq]=${sfilataSelezionata}`); // Sostituisci con l'endpoint reale
        const jsonData = await response.json();
        console.log('Eventi ricevuti:', jsonData);
        setEventi(jsonData.data); // Accedi a jsonData.data per l'array corretto
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };
  
    fetchEventi();
  }, [sfilataSelezionata]);

  // Funzione per gestire la selezione della sfilata
  const handleParadeSelect = (paradeNumber) => {
    setSfilataSelezionata(paradeNumber);
    console.log(`Sfilata selezionata: ${paradeNumber}`);
  };


  return (
    <>
    <Container style={{ paddingTop: '20px' }}>
    <CarnivaleParadeMenus onSelect={handleParadeSelect} />
    </Container>
    

    <Container style={{ paddingTop: '20px' }}>
      
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
    </>
  );
};

export default Page;
