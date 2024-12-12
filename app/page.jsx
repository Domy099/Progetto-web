"use client";
import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ClickableCard from './components/ClickableCard';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function App() {
  const menuItems = ['Home', 'Eventi', 'Mappa', 'Storia', 'Carri', 'Artisti'];
  const images = [
    'https://www.friggitoriasandomenico.com/wp-content/uploads/2023/01/carnevale-putignano.jpg',
    'https://www.toureventitalia.com/myadm/tiny/editor/file/putignano.jpeg'
  ];

  return (
    <div>
      {/* Main Content */}
      <Container className="mt-4">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom className="text-black">
              Benvenuti al Carnevale di Putignano!
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
            <Paper elevation={3} className="p-4">
              <Typography variant="h6" gutterBottom className="text-black">
                Meteo di Putignano
              </Typography>
              <Typography variant="body2" className="text-black">
                Soleggiato, 25°C
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Carousel Section */}
        <Grid container spacing={4} className="mt-4">
          <Grid item xs={12}>
            <Carousel showThumbs={false} autoPlay infiniteLoop>
              {images.map((src, index) => (
                <div key={index}>
                  <img src={src} alt={`Carousel ${index + 1}`} className="carousel-image" />
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
  );
}

export default App;