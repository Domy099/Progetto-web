"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import ActionAreaCard from "../ActionAreaCard";
import MultiActionAreaCard from "../Mappa/MultiActionAreaCard";

// URL per API
const STRAPI_POI_API_URL = process.env.NEXT_PUBLIC_STRAPI_POI_API_URL;
const GOOGLE_MAPS_API = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Stile della mappa
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

// Centro mappa: posizione predefinita (es. Putignano)
const defaultCenter = {
  lat: 40.849202,
  lng: 17.122637,
};

// Raggio di ricerca (km)
const searchRadius = 1.5;

// Funzione per calcolare la distanza (Haversine formula)
const calculateDistance = (pos1, pos2) => {
  const R = 6371; // Raggio della Terra in km
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(pos2.lat - pos1.lat);
  const dLng = toRad(pos2.lng - pos1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distanza in km
};

const GoogleMapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPoints, setNearbyPoints] = useState([]);
  const [nearbyMarkers, setNearbyMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  // Capisci se inserire la funzionalità
  const [showNearbyPoints, setShowNearbyPoints] = useState(false);

  // Recupera i punti dal server
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // Data di oggi
        const response = await axios.get(STRAPI_POI_API_URL);

        const data = response.data;
        if (data?.data?.length > 0) {
          const fetchedPoints = data.data
            .filter((point) => !point.evento || point.evento.data === today) // Filtra i punti
            .map((point) => ({
              id: point.idPOI,
              position: {
                lat: parseFloat(point.Latitudine),
                lng: parseFloat(point.Longitudine),
              },
              title: point.nome || "Punto dal server",
              icon: {
                url: point.Marker?.url
                  ? point.Marker.url.startsWith("http")
                    ? point.Marker.url
                    : "https://strapiweb.duckdns.org".concat(point.Marker.url)
                  : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new google.maps.Size(30, 30),
              },
              description: point.descrizione,
            }));
          setNearbyPoints(fetchedPoints);
        }
      } catch (error) {
        console.error("Errore nel recupero dei punti:", error);
      }
    };
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
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("L'utente ha negato l'accesso alla posizione.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Informazioni sulla posizione non disponibili.");
              break;
            case error.TIMEOUT:
              console.error("Richiesta di geolocalizzazione scaduta.");
              break;
            default:
              console.log("Errore sconosciuto nella geolocalizzazione.");
          }
          // Fallback: usa la posizione predefinita
          setUserLocation(defaultCenter);
        }
      );
    } else {
      console.error("La geolocalizzazione non è supportata dal browser.");
      setUserLocation(defaultCenter);
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
      {/* Mappa */}
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}
          zoom={15}
          options={{
            mapTypeControl: false,
            // mapTypeld: "satellite",
            // mapTypeld: "terrain",
            // mapTypeId: "hybrid"
            fullscreenControl: false,
            streetViewControl: false,
            // zoomControl: false,
            // disableDefaultUI: true,
            // draggable: false,
            // navigationControl: false
          }}
        >
          {/* Marker posizione utente */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="La tua posizione"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          )}

          {/* Marker dei punti vicini */}
          {nearbyPoints.map((point) => (
            <Marker
              key={point.id}
              position={point.position}
              title={point.title}
              icon={point.icon}
              onClick={() => setSelectedMarker(point)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)} // Chiudi la finestra
            >
              <div>
                <MultiActionAreaCard
                  title={selectedMarker.title}
                  description={selectedMarker.description}
                  position={selectedMarker.position}
                />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
