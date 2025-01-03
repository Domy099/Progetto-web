"use client";
import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ClickableCard from './components/ClickableCard';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import MeteoCard from './components/MeteoCard/MeteoCard';

function App() {
  const menuItems = ['Home', 'Eventi', 'Mappa', 'Storia', 'Carri', 'Artigiani'];

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
            <MeteoCard />
          </Grid>
        </Grid>

        {/* Carousel Section */}
        <Grid container spacing={4} className="mt-4">
          <Grid item xs={12}>
            <Carousel showThumbs={false} autoPlay infiniteLoop>
              <div>
                <img src="/img/1.jpg" alt="Carousel 1" className="carousel-image" />
              </div>
              <div>
                <img src="/img/2.jpg" alt="Carousel 2" className="carousel-image" />
              </div>
              <div>
                <img src="/img/3.jpg" alt="Carousel 3" className="carousel-image" />
              </div>
              <div>
                <img src="/img/4.jpg" alt="Carousel 4" className="carousel-image" />
              </div>
              <div>
                <img src="/img/5.jpg" alt="Carousel 5" className="carousel-image" />
              </div>
              <div>
                <img src="/img/6.jpg" alt="Carousel 6" className="carousel-image" />
              </div>
              <div>
                <img src="/img/7.jpg" alt="Carousel 7" className="carousel-image" />
              </div>
              <div>
                <img src="/img/8.jpg" alt="Carousel 8" className="carousel-image" />
              </div>
              <div>
                <img src="/img/9.jpg" alt="Carousel 9" className="carousel-image" />
              </div>
              <div>
                <img src="/img/10.jpg" alt="Carousel 10" className="carousel-image" />
              </div>
              <div>
                <img src="/img/11.jpg" alt="Carousel 11" className="carousel-image" />
              </div>
              <div>
                <img src="/img/12.jpg" alt="Carousel 12" className="carousel-image" />
              </div>
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