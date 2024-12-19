import React, { useState, useEffect } from 'react';
import './MeteoCard.css'; 
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, CardMedia } from '@mui/material';

const MeteoCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const city = 'Putignano';  // Paese o città definito a priori
  const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY; // Sostituisci con la tua chiave API di OpenWeather

  useEffect(() => {
    // Funzione per ottenere i dati meteo
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`
        );
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Errore nel recupero dei dati meteo", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography variant="body2">Impossibile ottenere i dati meteo.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="weather-card" style={{ display: 'flex', alignItems: 'center' }}>
  <CardMedia
    component="img"
    image={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
    className="weather-icon"
    style={{ width: '100px', height: '100px', marginRight: '16px' }} // Imposta le dimensioni e il margine a destra
  />
  <CardContent className="weather-content" style={{ flex: 1 }}>
    <Typography variant="h5" gutterBottom className="weather-city">
      {city}
    </Typography>
    <Typography variant="body1" className="weather-temp">
      Temperatura: {weatherData.main.temp}°C
    </Typography>
    <Typography variant="body2" className="weather-condition">
      Condizione: {weatherData.weather[0].description}
    </Typography>
  </CardContent>
</Card>

  );
};

export default MeteoCard;
