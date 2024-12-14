"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import MultiActionAreaCard from "./MultiActionAreaCard";

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

const GoogleMapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPoints, setNearbyPoints] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  //* Recupera i POI dal server senza eventi associati
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get(
          `${STRAPI_POI_API_URL}/api/pois?populate=*`
        );

        const data = response.data;

        if (data?.data?.length > 0) {
          const fetchedPoints = data.data
            .filter((point) => !point.evento)
            .map((point) => ({
              id: point.id || null,
              position: {
                lat: parseFloat(point.Latitudine) || 0,
                lng: parseFloat(point.Longitudine) || 0,
              },
              title: point.nome || "Punto dal server",
              icon: {
                url: point.Marker?.url
                  ? `https://strapiweb.duckdns.org${point.Marker.url}`
                  : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize:
                  window.google && window.google.maps
                    ? new google.maps.Size(30, 30)
                    : { width: 30, height: 30 },
              },
              description: point.descrizione || "Nessuna descrizione",
              eventImg: null,
              eventCode: point.matricola,
            }));

          setNearbyPoints(fetchedPoints);
        }
      } catch (error) {
        console.error(
          "Errore nel recupero dei punti:",
          error.response || error.message
        );
      }
    };

    fetchPoints();
  }, []);

  //*ANCHOR - Recupera i POI associati agli eventi
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await axios.get(
          `${STRAPI_POI_API_URL}/api/eventi?populate[0]=Locandina&populate[1]=pois.Marker`
        );

        const data = response.data;

        if (data?.data?.length > 0) {
          const fetchedPoints = data.data
            .flatMap((evento) =>
              evento.pois?.map((point) => ({
                id: point.id || null,
                position: {
                  lat: parseFloat(point.Latitudine) || 0,
                  lng: parseFloat(point.Longitudine) || 0,
                },
                title: evento.nome|| "Punto dal server",
                icon: {
                  url: point.Marker?.url
                    ? `${STRAPI_POI_API_URL}${point.Marker.url}`
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize:
                    window.google && window.google.maps
                      ? new google.maps.Size(30, 30)
                      : { width: 30, height: 30 },
                },
                description: evento.Descrizione || "Nessuna descrizione",
                eventCode: evento.matricola,
                eventPosition: evento.posizione,
                eventDate: evento.data,
                eventHour: evento.Orario || "Non definito",
                eventImg: evento.Locandina?.url
                  ? `${STRAPI_POI_API_URL}${evento.Locandina.url}`
                  : null, // Restituisce null se la locandina non esiste
              }))
            )
            .filter(Boolean); // Filtra eventuali elementi null o undefined

          setNearbyPoints((prevPoints) => [...prevPoints, ...fetchedPoints]);
        }
      } catch (error) {
        console.error(
          "Errore nel recupero dei punti degli eventi:",
          error.response || error.message
        );
      }
    };

    fetchEvents();
  }, []);

  //*ANCHOR -  Ottenere la posizione dell'utente
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
          console.error("Errore nella geolocalizzazione:", error.message);
          setUserLocation(defaultCenter);
        }
      );
    } else {
      console.error("La geolocalizzazione non è supportata.");
      setUserLocation(defaultCenter);
    }
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}
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
              {
                featureType: "poi.business",
                elementType: "all",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                elementType: "all",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {/* Marker per la posizione dell'utente */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="La tua posizione"
              icon={{
                url: "myPosition.svg",
                scaledSize:
                  window.google && window.google.maps
                    ? new google.maps.Size(30, 30)
                    : { width: 30, height: 30 },
              }}
            />
          )}

          {/* Marker per i POI */}
          {nearbyPoints.map((point) => (
            <Marker
              key={point.id}
              position={point.position}
              title={point.title}
              icon={point.icon}
              onClick={() => setSelectedMarker(point)}
            />
          ))}

          {/* InfoWindow */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              {selectedMarker.eventoid === null ? (
                <MultiActionAreaCard
                  title={selectedMarker.title || "Titolo non disponibile"}
                  description={
                    selectedMarker.description || "Nessuna descrizione"
                  }
                  position={selectedMarker.position}
                />
              ) : (
                <MultiActionAreaCard
                  image={selectedMarker.eventImg}
                  title={selectedMarker.title || "Titolo non disponibile"}
                  description={
                    selectedMarker.description || "Nessuna descrizione"
                  }
                  position={selectedMarker.position}
                  date={selectedMarker.eventDate}
                  hour={selectedMarker.eventHour}
                  eventPosition={selectedMarker.eventPosition}
                  eventCode={selectedMarker.eventCode}
                />
              )}
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
