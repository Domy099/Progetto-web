import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';

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
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography variant="h5">{city}</Typography>
        <Typography variant="body1">
          Temperatura: {weatherData.main.temp}°C
        </Typography>
        <Typography variant="body2">
          Condizione: {weatherData.weather[0].description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MeteoCard;
