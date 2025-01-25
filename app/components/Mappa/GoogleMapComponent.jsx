"use client"; // Comando Next.js per eseguire il componente lato client

import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import MultiActionAreaCard from "./MultiActionAreaCard";
import { FaFilter } from "react-icons/fa";
import { ThemeProvider, CssBaseline, Typography, Button, Box, Checkbox, FormControlLabel } from "@mui/material";
import theme from '../../../public/theme'; // Importa il tema personalizzato

// Configurazioni tramite variabili d'ambiente
const STRAPI_POI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  throw new Error("Google Maps API key is not defined");
}

// Stili per il container della mappa
const MAP_CONTAINER_STYLE = {
  width: "100vw",
  height: "100vh",
};

// Coordinate di default (Brindisi, Italia)
const DEFAULT_CENTER = {
  lat: 40.849202,
  lng: 17.122637,
};

const GoogleMapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapPoints, setMapPoints] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    Bagni: true,
    Parcheggi: true,
    Spettacoli: true,
    Eventi: true,
    Concerti: true,
    Ristoranti: true,
  });

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Errore geolocalizzazione:", error.message);
          setUserLocation(DEFAULT_CENTER);
        }
      );
    } else {
      console.error("Geolocalizzazione non supportata");
      setUserLocation(DEFAULT_CENTER);
    }
  }, []);

  const fetchPointsOfInterest = useCallback(async () => {
    try {
      const response = await axios.get(
        `${STRAPI_POI_API_URL}/api/pois?populate=*&filters[eventos][$null]=true`
      );

      return response.data.data
        .filter((point) => !point.evento)
        .map((point) => ({
          id: point.idPOI,
          tipo: "Punto di interesse",
          tipologia_POI: point.tipo_poi,
          position: {
            lat: parseFloat(point.Latitudine) || 0,
            lng: parseFloat(point.Longitudine) || 0,
          },
          title: point.nome || "Server Point",
          description: point.descrizione || "Nessuna descrizione",
          icon: {
            url: point.Marker?.url
              ? `https://strapiweb.duckdns.org${point.Marker.url}`
              : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: { width: 30, height: 30 },
          },
          eventCode: point.matricola,
        }));
    } catch (error) {
      console.error("Errore nel fetch dei POI:", error);
      return [];
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `${STRAPI_POI_API_URL}/api/eventi?populate[0]=Locandina&populate[1]=pois.Marker&pagination[pageSize]=100`
      );

      return response.data.data
        .flatMap((evento) =>
          evento.pois ? evento.pois.map((point) => ({
            id: point.idPOI,
            tipologia_POI: point.tipo_poi,
            position: {
              lat: parseFloat(point.Latitudine) || 0,
              lng: parseFloat(point.Longitudine) || 0,
            },
            title: evento.nome || "Event Point",
            description: evento.Descrizione || "Nessuna descrizione",
            tipo: evento.tipo || "Evento",
            icon: {
              url: point.Marker?.url
                ? `${STRAPI_POI_API_URL}${point.Marker.url}`
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: { width: 30, height: 30 },
            },
            eventImg: evento.Locandina?.url
              ? `${STRAPI_POI_API_URL}${evento.Locandina.url}`
              : null,
            eventDate: evento.data,
            eventHour: evento.Orario || "Non definito",
            eventPosition: evento.posizione,
            eventCode: evento.matricola,
          })) : []
        )
        .filter((point) => point.eventDate === today);
    } catch (error) {
      console.error("Errore nel fetch degli eventi:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        getUserLocation();

        const [poiPoints, eventPoints] = await Promise.all([
          fetchPointsOfInterest(),
          fetchEvents(),
        ]);

        setMapPoints([...poiPoints, ...eventPoints]);
      } catch (error) {
        console.error("Errore nel caricamento dati:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchPointsOfInterest, fetchEvents, getUserLocation]);

  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const filteredPoints = mapPoints.filter((point) => {
    return filters[point.tipologia_POI];
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>
        {isLoading ? (
          <Typography variant="h1">Caricamento...</Typography>
        ) : (
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={userLocation || DEFAULT_CENTER}
              zoom={15}
              options={{
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "all",
                    stylers: [{ visibility: "off" }],
                  },
                ],
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  zIndex: 1,
                }}
              >
                <Button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  sx={{
                    padding: "7px",
                    backgroundColor: "var(--azzurro)", // Colore di default
                    color: "white",
                    borderRadius: "10px", // Usa il raggio definito
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    "&:hover": {
                      backgroundColor: "var(--rosa)", // Colore al passaggio del mouse
                    },
                  }}
                >
                  <FaFilter /> Filtri
                </Button>

                {showFilterMenu && (
                  <Box
                    sx={{
                      marginTop: "10px",
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "5px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                      display: "flex",
                      flexDirection: "column", // Allinea le checkbox in colonna
                      gap: "8px", // Aggiunge spazio tra le checkbox
                    }}
                  >
                    {Object.keys(filters).map((filterName) => (
                      <FormControlLabel
                        key={filterName}
                        control={
                          <Checkbox
                            checked={filters[filterName]}
                            onChange={() => handleFilterChange(filterName)}
                          />
                        }
                        label={
                          <Typography variant="body1">
                            {filterName}
                          </Typography>
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {userLocation && (
                <Marker
                  position={userLocation}
                  title="La tua posizione"
                  icon={{
                    url: "myPosition.svg",
                    scaledSize: { width: 30, height: 30 },
                  }}
                />
              )}

              {filteredPoints.map((point) => (
                <Marker
                  key={`${point.id}-${point.eventCode}`}
                  position={point.position}
                  title={point.title}
                  icon={point.icon}
                  onClick={() => setSelectedMarker(point)}
                />
              ))}

              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <MultiActionAreaCard
                    image={selectedMarker.eventImg}
                    title={selectedMarker.title}
                    description={selectedMarker.description}
                    position={selectedMarker.position}
                    date={selectedMarker.eventDate}
                    hour={selectedMarker.eventHour}
                    eventPosition={selectedMarker.eventPosition}
                    eventCode={selectedMarker.eventCode}
                    tipo={selectedMarker.tipo}
                  />
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default GoogleMapComponent;