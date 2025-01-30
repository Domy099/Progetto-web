"use client";
import React, { useEffect, useState } from 'react';
import CarriCard from '../components/CarriCard';
import { Box, Container, Grid, Typography, Divider } from '@mui/material';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/public/theme';
import LeaderBoardVoti from '../components/LeaderBoardVoti';

const Page = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [carri, setCarri] = useState([]);

  useEffect(() => {
    const fetchCarri = async () => {
      try {
        const response = await fetch(`${STRAPI_API_URL}/api/carri?populate[voti][count]=true&populate=immagine`);
        const jsonData = await response.json();
        setCarri(jsonData.data);
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };
    fetchCarri();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <Typography variant="h2" align="center" sx={{ marginTop: 4 }}>
          Il podio ufficiale
        </Typography>
        <LeaderBoardVoti carri={carri} />
      </Container>

      <Typography variant="h1" align="center" sx={{ marginTop: 4 }}>
        I carri
      </Typography>
      <Typography variant="body1" align="center" sx={{ marginTop: 1 }}>
        Arte e magia si uniscono per creare qualcosa di unico
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 3 }}>
        <Divider sx={{ borderRadius: '20px', marginTop: '20px', width: '60%' }} />
      </Box>
      {carri && carri.length > 0 ? (
        <Container style={{ paddingTop: '20px' }}>
          <Grid container spacing={4} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' }, marginBottom: 4 }}>
            {carri.map((carro) => (
              <Grid item key={carro.idCarro} xs={10} sm={6} md={4}>
                <Link href={`/carri/${carro.idCarro}`} passHref>
                  <CarriCard
                    title={carro.nome}
                    description={carro.descrizione}
                    image={carro.immagine?.url ? `${STRAPI_API_URL}${carro.immagine.url}` : `https://placehold.co/600x400?text=${carro.nome}`}
                    altText={`Immagine del carro ${carro.nome}`}
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

        </Container>)
        : (
          <Typography variant="body2" color="text.secondary" align="center">
            Non ci sono carri al momento, torna più tardi.
          </Typography>
        )
      }

    </ThemeProvider>
  );
};

export default Page;
