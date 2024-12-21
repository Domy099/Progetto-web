"use client";
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import Link from 'next/link';
import GenericCard from '../components/GenericCard'; // Importa il componente ActionAreaCard
import ContenutoCard from '../components/ContenutoCard';

const Storia = () => {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [contenuti, setContenuti] = useState([]);

  // Caricamento dei contenuti da Strapi
  useEffect(() => {
  
      const fetchContenutiDetails = async () => {
        try {
          const response = await fetch(
            `${STRAPI_API_URL}/api/contenuti`
          );
          const data = await response.json();
  
          if (data && data.data) {
  
            setContenuti(data.data);
            console.log(contenuti);
  
          } else {
            console.warn("Nessun contenuto trovato.");
          }
        } catch (error) {
          console.error("Errore nel recuperare i dati:", error);
        }
      };
  
      fetchContenutiDetails();
    }, []);
  

  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom color = "text.secondary">
        La Storia del Carnevale di Putignano
      </Typography>

      {/* Sezione 1: Introduzione */}
<Box mb={4}>
  
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
    <Typography variant="h4" gutterBottom color="text.secondary">
    Introduzione
  </Typography>
      <Typography color="text.secondary">
        Il Carnevale di Putignano è uno dei più antichi d'Europa, le sue origini risalgono al Medioevo, con una tradizione che si rinnova ogni anno con sfilate, maschere e carri allegorici.
      </Typography>
    </Grid>
    <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image="https://www.carnevalediputignano.it/home/wp-content/uploads/2019/12/storia_slide3.jpg" // Sostituisci con l'immagine appropriata
          alt="Immagine Carnevale Putignano"
        />
      </Card>
    </Grid>
  </Grid>
</Box>

{/* Sezione 2: La Storia */}
<Box mb={4}>
  
  <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
    
    {/* Testo a destra */}
    <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
    <Typography variant="h4" gutterBottom color="text.secondary" textAlign="right">
    La Storia
  </Typography>
      <Typography color="text.secondary" textAlign="right">
        Il Carnevale di Putignano ha radici che affondano nel periodo medievale, quando la festa nasce come rito di purificazione prima della Quaresima. Ogni anno, la città si trasforma in un palcoscenico di colori, musica e danze.
      </Typography>
    </Grid>
    
    {/* Immagine a sinistra */}
<Grid item xs={12} md={6} display="flex" justifyContent="flex-start">
  <Card>
    <CardMedia
      component="img"
      height="300"
      image="https://www.carnevalediputignano.it/home/wp-content/uploads/2020/01/PROPAGGINI_2018_05.jpg" // Sostituisci con l'immagine appropriata
      alt="Immagine Storia Carnevale"
    />
  </Card>
</Grid>

  </Grid>
</Box>


{/* Sezione 3: Tradizioni */}
<Box mb={4}>
  
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
    <Typography variant="h4" gutterBottom color="text.secondary">
    Le Tradizioni
  </Typography>
      <Typography color="text.secondary">
        Durante il Carnevale di Putignano, le tradizioni sono alla base di ogni evento. Dalla sfilata dei carri allegorici alla distribuzione di dolci tipici come le "chiacchiere", ogni dettaglio celebra la cultura popolare del territorio.
      </Typography>
    </Grid>
    <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image="https://www.carnevalediputignano.it/home/wp-content/uploads/2020/01/T8I5242.jpg" // Sostituisci con l'immagine appropriata
          alt="Immagine Tradizioni Carnevale"
        />
      </Card>
    </Grid>
  </Grid>
</Box>



      {/* Sezione 4: Contenuti Caricati dal Server (Strapi) */}
      
        <Typography variant="h4" gutterBottom align="center" color = "text.secondary">
          Contenuti Speciali del Carnevale
        </Typography>
        {contenuti && contenuti.length > 0 ? (
          <Box mt={5}>
          <Grid container spacing={4}>
            {contenuti.map((contenuto) => (
              <Grid 
                item 
                key={contenuto.idContenuto} 
                xs={12}
                sm={6}      
                md={4} 
              >
                <Link 
                  href={`/storia/${contenuto.idContenuto}`} 
                  passHref 
                  style={{ textDecoration: 'none' }}
                >
                  <ContenutoCard
                    title={contenuto.titolo}
                    data={contenuto.publishedAt}
                    image={contenuto.Immagine || 'https://placehold.co/600x400'}
                    altText={`Immagine del contenuto`}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            Non ci sono contenuti al momento, torna più tardi.
          </Typography>
        )}

      
      
    </Container>
  );
};

export default Storia;
