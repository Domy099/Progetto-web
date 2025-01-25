"use client";
import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ClickableCard from './components/ClickableCard';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import MeteoCard from './components/MeteoCard/MeteoCard';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../public/theme';
import { Icon, IconButton } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';


function App() {
  const menuItems = ['Home', 'Eventi', 'Mappa', 'Storia', 'Carri', 'Artigiani'];
  const imageArray = ["/img/1.jpg", "/img/2.jpg", "/img/3.jpg", "/img/4.jpg", "/img/5.jpg", "/img/6.jpg", "/img/7.jpg", "/img/8.jpg", "/img/9.jpg", "/img/10.jpg", "/img/11.jpg", "/img/12.jpg"];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {/* Main Content */}
        <Container >
          <Grid container spacing={4} sx={{ marginTop: 0}}>
            <Grid item xs={12} md={8}>
              <Typography variant="h1" marginBottom={2} lineHeight={1.5} >
                Benvenuti al Carnevale di Putignano
              </Typography>


              <Typography variant="body1" paragraph className="text-black">
                Unisciti a noi per una celebrazione colorata e vivace con costumi, musica e tanto divertimento!
              </Typography>
              <Typography variant="body1" paragraph className="text-black">
                Scopri le tradizioni e le storie dietro il carnevale, e partecipa alle nostre attività e sfilate.
              </Typography>
              <Typography variant="body1" paragraph className="text-black">
                Non perdere l'occasione di vivere un'esperienza unica e indimenticabile!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <MeteoCard />
            </Grid>
          </Grid>

          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: '30px',
              alignItems: 'center',
              backgroundColor: '#558db2',
              padding: '15px',
              gap: '10px',
            }}
          >
            <Icon sx={{ color: '#f9ee74', mr: 1, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
              <NewReleasesIcon />
            </Icon>
            <Typography variant="h2" color={'#f9ee74'}>
              Preparati al carnevale più lungo e più intenso d'Italia!
            </Typography>
          </span>

          {/* Carousel Section */}
          <Grid container spacing={4} className="mt-4">
            <Grid item xs={12} >
              <Carousel showThumbs={false} autoPlay infiniteLoop>
                {imageArray.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Carousel ${index + 1}`} className="carousel-image" />
                  </div>
                ))}
              </Carousel>
            </Grid>
          </Grid>

          {/* Cards Section */}
          <Grid container spacing={4} className="mt-4">
            {menuItems.slice(1).map((item) => (
              <ClickableCard key={item} item={item} />
            ))}
          </Grid>
        </Container>
      </div>

    </ThemeProvider>
  );
}

export default App;