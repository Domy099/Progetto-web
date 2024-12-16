"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from 'axios';

const STRAPI_POI_API_URL = process.env.NEXT_PUBLIC_STRAPI_POI_API_URL
const GOOGLE_MAPS_API = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Stile per la mappa
const containerStyle = {
  width: "100vw", // Larghezza a tutto schermo
  height: "100vh", // Altezza a tutto schermo
};

// Centro della mappa: Centro di Putignano
const universityCenter = {
  lat: 40.849202, // Latitudine dell'università
  lng: 17.122637, // Longitudine dell'università
};

// Lista iniziale di punti vicini all'università
const initialNearbyPoints = [];

// Funzione per calcolare la distanza tra due punti (Haversine formula)
const calculateDistance = (pos1, pos2) => {
  const R = 6371; // Raggio della Terra in km
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(pos2.lat - pos1.lat);
  const dLng = toRad(pos2.lng - pos1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distanza in km
};

const GoogleMapComponent = () => {
  // Stato per salvare la posizione dell'utente
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPoints, setNearbyPoints] = useState(initialNearbyPoints);
  //Controlla
  // TODO Controlla se serve
  const [data, setData] = useState(null);
  const [showNearbyPoints, setShowNearbyPoints] = useState(false);
  const [nearbyMarkers, setNearbyMarkers] = useState([]);
  const searchRadius = 1.5; // Raggio di ricerca in km

   // Recupera i punti dal server tramite fetch
   useEffect(() => {
     const today = new Date().toISOString().split('T')[0]; // Ottieni la data di oggi in formato YYYY-MM-DD
     // Funzione per recuperare i dati
     const fetchPoints = async () => {
       try {
         // Effettua la richiesta usando Axios
         const response = await axios.get(STRAPI_POI_API_URL);

         // Assicurati che ci siano dati validi
         const data = response.data;
         if (data && data.data && data.data.length > 0) {
           const fetchedPoints = data.data
             .filter((point) => !point.evento || point.evento.data === today) // Filtra i punti senza evento
             .map((point) => {
               const markerUrl = point.Marker?.url
                 ? (point.Marker.url.startsWith('http')
                     ? point.Marker.url
                     : "https://strapiweb.duckdns.org".concat(point.Marker.url))
                 : "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

               return {
                 id: point.idPOI, // Usa un ID unico
                 position: {
                   lat: parseFloat(point.Latitudine), // Converte in numero
                   lng: parseFloat(point.Longitudine),
                 },
                 title: point.nome || "Punto dal server",
                 icon: {
                   url: markerUrl, // Icona personalizzata
                   scaledSize:  { width: 30, height: 30 }
                 },
               };
             });

           // Aggiungi i punti alla lista esistente
           setNearbyPoints((prevPoints) => [...prevPoints, ...fetchedPoints]);
         }
       } catch (error) {
         console.error("Error fetching data:", error); // Gestisce errori
       }
     };

     // Chiama la funzione per recuperare i punti
     fetchPoints();
   }, []);

  // Ottenere la posizione dell'utente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Errore nella geolocalizzazione", error);
        }
      );
    }
  }, []);

  // Filtrare i marker vicini
  useEffect(() => {
    if (userLocation) {
      const filteredMarkers = nearbyPoints.filter((point) => {
        const distance = calculateDistance(userLocation, point.position);
        return distance <= searchRadius;
      });
      setNearbyMarkers(filteredMarkers);
    }
  }, [userLocation, nearbyPoints]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Mappa a tutto schermo */}
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || universityCenter}
          zoom={15}
        >
          {/* Marker della posizione dell'utente */}
          {userLocation && (
             <Marker
             position={userLocation}
             title="La tua posizione"
             icon={{
               url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Percorso al file PNG nella cartella `public/icons`
               scaledSize:  { width: 30, height: 30 }, // Dimensioni dell'icona personalizzata
              }}
           />
          )}

          {/* Marker dei punti vicini */}
          {nearbyPoints.map((point) => (
            <Marker key={point.id} position={point.position} title={point.title} icon={point.icon}/>
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Bottone "Punti vicino a me" */}
      <button
        onClick={() => setShowNearbyPoints(!showNearbyPoints)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 15px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Punti vicino a me
      </button>

      {/* Riquadro dei punti vicini */}
      {showNearbyPoints && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            maxHeight: "50%",
            backgroundColor: "white",
            overflowY: "auto",
            boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            padding: "15px",
          }}
        >
          <h3>Punti vicini a te (entro {searchRadius} km):</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {userLocation && nearbyMarkers.length > 0 ? (
              nearbyMarkers.map((marker) => (
                <li
                  key={marker.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                  }}
                >
                  <span>{marker.title}</span>
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}`,
                        "_blank"
                      )
                    }
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#34A853",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Apri su Maps
                  </button>
                </li>
              ))
            ) : (
              <li>Nessun punto vicino trovato.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;