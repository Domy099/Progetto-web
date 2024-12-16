"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import MultiActionAreaCard from "./MultiActionAreaCard";


// Configuration
const STRAPI_POI_API_URL = process.env.NEXT_PUBLIC_STRAPI_POI_API_URL;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Styles
const MAP_CONTAINER_STYLE = {
  width: "100vw",
  height: "100vh",
};

const DEFAULT_CENTER = {
  lat: 40.849202,
  lng: 17.122637,
};

const GoogleMapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapPoints, setMapPoints] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Trovo la posizione dell'utente
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
          console.error("Geolocation error:", error.message);
          setUserLocation(DEFAULT_CENTER);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setUserLocation(DEFAULT_CENTER);
    }
  }, []);

  // Promessa per POI non associati ad eventi
  const fetchPointsOfInterest = useCallback(async () => {
    try {
      const response = await axios.get(
        `${STRAPI_POI_API_URL}/api/pois?populate=*`
      );

      return response.data.data
        .filter((point) => !point.evento)
        .map((point) => ({
          id: point.id,
          position: {
            lat: parseFloat(point.Latitudine) || 0,
            lng: parseFloat(point.Longitudine) || 0,
          },
          title: point.nome || "Server Point",
          description: point.descrizione || "No description",
          icon: {
            url: point.Marker?.url
              ? `https://strapiweb.duckdns.org${point.Marker.url}`
              : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: { width: 30, height: 30 },
          },
          eventCode: point.matricola,
        }));
    } catch (error) {
      console.error("Error fetching points:", error);
      return [];
    }
  }, []);

  // Fetch Eventi che hanno la data corrente
  const fetchEvents = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `${STRAPI_POI_API_URL}/api/eventi?populate[0]=Locandina&populate[1]=pois.Marker`
      );

      return response.data.data
        .flatMap((evento) =>
          evento.pois?.map((point) => ({
            id: point.id,
            position: {
              lat: parseFloat(point.Latitudine) || 0,
              lng: parseFloat(point.Longitudine) || 0,
            },
            title: evento.nome || "Event Point",
            description: evento.Descrizione || "No description",
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
            eventHour: evento.Orario || "Not defined",
            eventPosition: evento.posizione,
            eventCode: evento.matricola,
          }))
        )
        .filter((point) => point.eventDate === today);
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }, []);

  // Initial data loading
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
        console.error("Data loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchPointsOfInterest, fetchEvents, getUserLocation]);

  // Render guard
  if (!STRAPI_POI_API_URL || !GOOGLE_MAPS_API_KEY) {
    return <div>Configuration Error: Missing API keys</div>;
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {isLoading ? (
        <div>Loading...</div>
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
            {userLocation && (
              <Marker
                position={userLocation}
                title="Your Location"
                icon={{
                  url: "myPosition.svg",
                  scaledSize: { width: 30, height: 30 },
                }}
              />
            )}

            {mapPoints.map((point) => (
              <Marker
                key={`${point.id}-${point.eventCode}`}
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
      )}
    </div>
  );
};

export default GoogleMapComponent;
