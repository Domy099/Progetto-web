"use client";
import React, { useEffect, useState } from 'react';
import ActionAreaCard from '../components/GenericCard'; // Importa il componente ActionAreaCard
import { Container, Grid, Box, Divider } from '@mui/material';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../public/theme';

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ paddingTop: '20px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} marginBottom={4}>
          <Typography
            variant="h1" component="h1" align="center" sx={{ marginTop: 4 }}>
            I creatori della magia
          </Typography>
          <Typography variant='body1' component='p' align='center'>
            Un incrocio di mani, occhi e cuori unito da un obiettivo comune, gruppi che si trasformano in famiglie.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
            <Divider sx={{ borderRadius: '20px', marginTop: '20px', width: '60%' }} />
          </Box>
        </Box>

        <Container style={{ paddingTop: '20px' }}>
          <Grid container spacing={4} sx={{ justifyContent: { xs: 'center', md: 'center', sm: 'flex-start' },mb: 4 }}>
            {artigiani.map((artigiano) => (
              <Grid item key={artigiano.idArtigiano} xs={12} sm={6} md={4}>
                <Link href={`/artigiani/${artigiano.idArtigiano}`} passHref>
                  <ActionAreaCard
                    nome={artigiano.nome}
                    cognome={artigiano.cognome}
                    storia={artigiano.storia}
                    immagine={artigiano.immagine?.url ? `${STRAPI_API_URL}${artigiano.immagine.url}` : 'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'}
                    altText={`Immagine dell'artigiano ${artigiano.nome} ${artigiano.cognome}`}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </ThemeProvider>
  );

}

export default Page;
