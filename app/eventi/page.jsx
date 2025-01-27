"use client";
import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard'; // Importa il componente ActionAreaCard
import SfilateSelector from '../components/Menu';
import { Container, Grid, Typography, Box, Divider } from '@mui/material';
import Link from 'next/link';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../public/theme';

const Page = () => {
  const [eventi, setEventi] = useState([]); // Stato per i dati dei carri
  const [sfilataSelezionata, setSfilataSelezionata] = useState(1);
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  // Effettua la chiamata all'API per ottenere i dati dei carri
  useEffect(() => {
    const fetchEventi = async () => {
      try {
        const response = await fetch(`${STRAPI_API_URL}/api/eventi?filters[sfilata][$eq]=${sfilataSelezionata}&populate=Locandina`); // Sostituisci con l'endpoint reale
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h1" align="center" sx={{ marginTop: 4 }}>
            Gli eventi
          </Typography>
          <Typography variant="body1" align="center" >
            A Putignano il divertimento non finisce mai. Esplora un mondo di eventi e tradizioni
          </Typography>
        </Box>
      </Container>
      <Container style={{ marginBottom: '5px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
          <Divider sx={{ borderRadius: '20px', marginTop: '20px', width: '60%' }} />
          <SfilateSelector onSelect={handleParadeSelect} />
        </Box>
      </Container>
      <Container style={{ paddingTop: '20px' }}>
        <Grid container spacing={4} sx={{justifyContent: { xs: 'center', sm: 'flex-start' }}}>
          {/* https://placehold.co/600x400?text=${evento.nome} */}
          {eventi.map((evento) => (
            <Grid item key={evento.matricola || evento.id} xs={10} sm={6} md={4}>
              <Link href={`/eventi/${evento.matricola}`} passHref>
                <EventCard
                  title={evento.nome}
                  description={evento.Descrizione}
                  image={evento.Locandina?.url ? `${STRAPI_API_URL}${evento.Locandina.url}` : `https://picsum.photos/seed/${evento.matricola}/200/300`}
                  altText={evento.nome}
                  tipo={evento.tipo || 'Evento'}
                  data={evento.data}
                  orario={evento.Orario}
                  posizione={evento.posizione}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    padding: 2,
                  }}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>

  );

};

export default Page;
