"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Card, CardContent, CardMedia, Box, Button } from "@mui/material";
import jwt from "jsonwebtoken";

export default function CarroDetailPage({ params }) {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const router = useRouter();
  const { idCarro } = React.use(params);

  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [carroDetails, setCarroDetails] = useState(null);
  const oggi = new Date();
  const [idUtente, setIdUtente] = useState(null);
  const [VotiDetails, setVotiDetails] = useState(null);
  const [idCarroVoto, setIdCarroVoto] = useState(null);

  // FETCH DATI DEL CARRO
  useEffect(() => {
    if (!idCarro) return;

    const fetchCarroDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/carri?filters[idCarro][$eq]=${idCarro}&populate=artigiani`
        );
        const data = await response.json();
        setCarroDetails(data.data[0]);

        setIdCarroVoto(data.data[0].id);

        setLoading(false);
      } catch (error) {
        console.error("Errore nel recuperare i dati del carro", error);
        setLoading(false);
      }
    };

    fetchCarroDetails();
  }, [idCarro]);

  const fetchVoti = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Devi effettuare l'accesso per inviare un voto");
        router.push("/login");
        return { hasVoted: false, votiDetails: null };
      }
  
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.id) {
        alert("Errore durante l'autenticazione, accedi nuovamente.");
        router.push("/login");
        return { hasVoted: false, votiDetails: null };
      }
  
      const idUtente = decoded.id;
      setIdUtente(idUtente);
  
      setLoading(true);
  
      const response = await fetch(
        `https://strapiweb.duckdns.org/api/voti?filters[votante][id][$eq]=${idUtente}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) throw new Error("Errore nella risposta della API");
  
      const voti = await response.json();
      const hasVoted = voti.data && voti.data.length > 0;
  
      setLoading(false);
      return { hasVoted, votiDetails: hasVoted ? voti.data[0] : null };
    } catch (error) {
      console.error("Errore nel recuperare i feedback utente:", error);
      setLoading(false);
      return { hasVoted: false, votiDetails: null };
    }
  };
  

  const handleVotaClick = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Devi effettuare l'accesso per votare.");
      router.push("/login");
      return;
    }
  
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    setIdUtente(userId);
  
    const { hasVoted } = await fetchVoti();
  
    if (hasVoted) {
      alert("Hai già votato per un carro.");
      return;
    }
  
    setLoading(true);
    try {
      const votoData = {
        data: {
          carri: { id: idCarroVoto },
          votante: { id: userId },
        },
      };
  
      const response = await fetch("https://strapiweb.duckdns.org/api/voti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(votoData),
      });
  
      if (!response.ok) throw new Error("Errore nel registrare il voto");
  
      const responseData = await response.json();
      setHasVoted(true);
      alert("Voto registrato con successo!");
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (!carroDetails) {
    return <Typography>Caricamento...</Typography>;
  }

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" gap={4} mt={12}>
        <Box flexShrink={0} maxWidth="50%" sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={carroDetails.urlFoto}
            alt={`Foto del carro ${carroDetails.nome}`}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>

        <Box flex={1}>
          <Typography variant="h4" component="h1" gutterBottom>
            {carroDetails.nome}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Descrizione:
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {carroDetails.descrizione}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleVotaClick} sx={{ mt: 2 }}>
            Vota
          </Button>
        </Box>
      </Box>

      <Container>
        <Typography variant="h6" gutterBottom>
          Artigiani:
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          {carroDetails.artigiani.length > 0 ? (
            carroDetails.artigiani.map((artigiano) => (
              <Card key={artigiano.idArtigiano} sx={{ display: "flex", width: "600px", height: 160 }}>
                <CardMedia
                  component="img"
                  sx={{
                    flexShrink: 0,
                    width: "auto",
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                  image={
                    "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg"
                  }
                />
                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 2 }}>
                  <Typography variant="h6" component="p" sx={{ marginBottom: 1 }}>
                    {artigiano.nome} {artigiano.cognome}
                  </Typography>

                  <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
                    Storia dell'artigiano:
                  </Typography>
                  <Typography variant="body2" component="p">
                    {artigiano.storia}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nessuna informazione sugli artigiani.
            </Typography>
          )}
        </Box>
      </Container>
    </Container>
  );
}