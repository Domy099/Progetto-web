"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Container, Typography, Card, CardContent, CardMedia, Box, Button, Grid, Icon, Chip } from '@mui/material';
import { Event, LocationOn, DateRange, Description } from '@mui/icons-material';
import jwt from 'jsonwebtoken';
import MultiLineInput from '../../components/MultiLineInput';
import BottoneIndietro from '../../components/IndietroButton';
import { use } from 'react';
import POICard from '../../components/POICard';

export default function EventoDetailPage({ params }) {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  //const matricola = params?.matricola;
  const matricola = use(params).matricola;
  //const {matricola} = params;
  const [hasVoted, setHasVoted] = useState(false);
  const [eventoDetails, setEventoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idUtente, setIdUtente] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const router = useRouter();
  const [idEvento, setIdEvento] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showForm, setShowForm] = useState(false); // Stato per mostrare/nascondere il form
  const oggi = new Date().toISOString().split('T')[0];


  useEffect(() => {
    if (!matricola) return;

    const fetchEventoDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/eventi?filters[matricola][$eq]=${matricola}&populate=pois`
        );
        const data = await response.json();

        if (data?.data?.length > 0) {
          setEventoDetails(data.data[0]);
          setIdEvento(data.data[0].id);

        } else {
          console.warn("Nessun evento trovato per la matricola fornita.");
        }
      } catch (error) {
        console.error("Errore nel recuperare i dati dell'evento:", error);
      }
    };

    fetchEventoDetails();
  }, []);

  // FETCH DATI DEI VOTI PER VERIFICARE SE L'UTENTE HA GIA' VOTATO
  const fetchFeedback = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Utente non autenticato!");
        alert("Devi effettuare l'accesso per inviare un feedback");
        router.push("/login");
        return { hasVoted: false, feedbackDetails: null };
      }

      const decoded = jwt.decode(token);
      if (!decoded || !decoded.id) {
        console.error("Token non valido o ID utente non presente!");
        alert("Errore durante l'autenticazione, accedi nuovamente.");
        router.push("/login");
        return { hasVoted: false, feedbackDetails: null };
      }

      const idUtente = decoded.id;
      setIdUtente(idUtente);

      setLoading(true);

      const response = await fetch(
        `${STRAPI_API_URL}/api/feedbacks?filters[visitatore][$eq]=${idUtente}&filters[evento][$eq]=${idEvento}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Errore nella risposta della API");
      }

      const voti = await response.json();
      const hasVoted = voti.data && voti.data.length > 0;

      setLoading(false);

      return { hasVoted, feedbackDetails: hasVoted ? voti.data[0] : null };
    } catch (error) {
      console.error("Errore nel recuperare i feedback utente:", error);
      setLoading(false);
      return { hasVoted: false, feedbackDetails: null };
    }
  };


  //fetchFeedback();
  //}, [idEvento]);

  //Gestisce l'invio del feedback
  const handleFeedbackClick = async () => {
    const { hasVoted, feedbackDetails } = await fetchFeedback();

    if (hasVoted) {
      setShowForm(false);
      alert("Hai già inviato un feedback per questo evento");
    } else {
      setShowForm(true);
    }
  };


  const handleSubmitFeedback = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("Utente non autenticato!");
      alert("Devi effettuare l'accesso per inviare un feedback");
      router.push("/login");
      return;
    }

    const decoded = jwt.decode(token);
    const userId = decoded.id;

    setLoading(true);

    try {
      const feedbackData = {
        data: {
          evento: { id: idEvento },
          visitatore: { id: userId },
          descrizione: feedbackText,
        },
      };

      const response = await fetch(`${STRAPI_API_URL}/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error("Errore nel registrare il feedback");
      }

      const responseData = await response.json();
      console.log("Feedback registrato con successo:", responseData);

      setHasVoted(true);
      setShowForm(false);
      alert("Grazie per aver inviato il feedback!");
    } catch (error) {
      console.error("Errore durante l'invio del feedback:", error);
    } finally {
      setLoading(false);
    }
  };





  if (!eventoDetails) {
    return <Typography>Caricamento...</Typography>;
  }

  return (
    <Container>
      <BottoneIndietro destinazione="/eventi" />
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="flex-start"
        gap={4}
        mt={12}
      >
        {/* Immagine dell'evento a sinistra (opzionale se esiste un'immagine) */}
        <Box
          flexShrink={0}
          sx={{
            maxWidth: { xs: "100%", sm: "40%" },
          }}
        >
          <img
            /*FIXME - Rivedi, non mostra la locandina anche se è presente*/
            src={ `https://placehold.co/400x600?text=${eventoDetails.nome}`
              /*
              eventoDetails.Locandina.url 
                ? `${STRAPI_API_URL}${eventoDetails.Locandina.url}` 
                : `https://placehold.co/400x600?text=${eventoDetails.nome}`*/
            }
            alt={`Locandina dell'evento ${eventoDetails.nome}`}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "400px",
              maxWidth: "400px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>

        {/* Dettagli dell'evento a destra */}
        <Box flex={1}>
        <Chip
            label={eventoDetails.tipo}
            sx={{
              alignSelf: 'flex-start',
              backgroundColor: '#fdd835',
              color: 'white',
              marginBottom: 1,  // Ridotto lo spazio sotto il Chip
              marginTop: 0,     // Rimosso lo spazio sopra il Chip
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom color="text.secondary" sx={{ marginBottom: 1 }}>
            {eventoDetails.nome}
          </Typography>

          <Grid container spacing={2} alignItems="center" mt={1}> {/* Ridotto lo spazio sopra il Grid */}
            {/* Descrizione */}
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              <Typography variant="h6" gutterBottom color="text.secondary">
                Descrizione:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {eventoDetails.Descrizione}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={1} direction="column"> {/* Ridotto lo spazio sopra il secondo Grid */}
            {/* Data */}
            <Grid item xs={12} display="flex" alignItems="center">
              <Icon sx={{ color: 'text.secondary', mr: 1, fontSize: 28, lineHeight: 'normal' }}>
                <DateRange />
              </Icon>
              <Typography variant="body1" color="text.secondary">
                Data: {new Date(eventoDetails.data).toLocaleDateString()}
              </Typography>
            </Grid>

            {/* Posizione */}
            <Grid item xs={12} display="flex" alignItems="center">
              <Icon sx={{ color: 'text.secondary', mr: 1, fontSize: 28, lineHeight: 'normal' }}>
                <LocationOn />
              </Icon>
              <Typography variant="body1" color="text.secondary">
                Posizione: {eventoDetails.posizione || 'Non specificata'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

      </Box>

      {/* Punti di interesse */}
      <Typography variant="h6" gutterBottom color="text.secondary" sx={{ mt: 4 }}>
        Punti di Interesse dell'evento:
      </Typography>

      {eventoDetails && eventoDetails.pois && eventoDetails.pois.length > 0 ? (
        <Box mt={4}>
          {eventoDetails.pois.map((poi) => (
            <POICard
            key={poi.idPOI}
            nome={poi.nome}
            descrizione={poi.descrizione}
          />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Nessun punto di interesse disponibile.
        </Typography>
      )}

      {/* Confronta la data odierna con quella dell'evento per il feedback */}
      {oggi >= eventoDetails?.data && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFeedbackClick}
            sx={{ mt: 2 }}
          >
            Lascia un feedback
          </Button>

          {showForm && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
                Scrivi il tuo feedback
              </Typography>
              <TextField
                multiline
                rows={3} // Numero di righe visibili
                fullWidth // Per occupare tutta la larghezza del container
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Inserisci qui il tuo feedback..."
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmitFeedback}
                sx={{
                  mt: 2, // Margine superiore
                  backgroundColor: '#EA580C', // Colore di sfondo personalizzato
                  '&:hover': { backgroundColor: '#D1550A' } // Colore al passaggio del mouse
                }}
              >
                Invia
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );

}

