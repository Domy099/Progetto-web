"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Container, Typography, Box, Button, Grid, Chip, Divider } from '@mui/material';
import jwt from 'jsonwebtoken';
import BottoneIndietro from '../../components/IndietroButton';
import { use } from 'react';
import POICard from '../../components/POICard';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/public/theme';
import LoadingCircle from '@/app/components/LoadingCircle';

export default function EventoDetailPage({ params }) {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const matricola = use(params).matricola;
  const [hasVoted, setHasVoted] = useState(false);
  const [eventoDetails, setEventoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idUtente, setIdUtente] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const router = useRouter();
  const [idEvento, setIdEvento] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const oggi = new Date().toISOString().split('T')[0];


  useEffect(() => {
    if (!matricola) return;

    const fetchEventoDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/eventi?filters[matricola][$eq]=${matricola}&populate[pois][populate]=*&populate=Locandina`
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
    fetchFeedback();

    Promise.all([fetchEventoDetails(), fetchFeedback()]).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [idEvento, hasVoted]);

  // FETCH DATI DEI VOTI PER VERIFICARE SE L'UTENTE HA GIA' VOTATO
  const fetchFeedback = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.log("Utente non autenticato!");
        return;
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
      console.log("Voti utente:", voti);
      const hasVoted = voti.data && voti.data.length > 0;

      setLoading(false);
      hasVoted ? setFeedbackDetails(voti.data[0]) : null;
      return hasVoted;
    } catch (error) {
      console.error("Errore nel recuperare i feedback utente:", error);
      setLoading(false);
      return { hasVoted: false, feedbackDetails: null };
    }
  };

  //Gestisce l'invio del feedback
  const handleFeedbackClick = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.log("Utente non autenticato!");
      alert("Devi effettuare l'accesso per inviare un feedback");
      router.push("/login");
      return;
    }
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
      console.log("Utente non autenticato!");
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
    return (<LoadingCircle />);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <BottoneIndietro destinazione="/eventi" />
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="flex-start"
          gap={4}
          mt={3}
        >
          <Box
            flexShrink={0}
            sx={{
              maxWidth: { xs: "100%", sm: "40%" },
            }}
          >
            <img
              src={
                eventoDetails?.Locandina?.url
                  ? `${STRAPI_API_URL}${eventoDetails.Locandina.url}`
                  : `https://placehold.co/400x500?text=${eventoDetails.nome}`
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

          <Box flex={1}>
            {eventoDetails.tipo &&
              <Chip
                label={eventoDetails.tipo}
                sx={{
                  alignSelf: 'flex-start',
                  ...getColoriChip(eventoDetails.tipo),
                  marginBottom: 2,
                  marginTop: 2,
                  typography: 'label',
                  color: 'white',
                }}
              />}
            <Typography variant="h1" component="h1" sx={{ marginBottom: 1 }}>
              {eventoDetails.nome}
            </Typography>

            <Grid container spacing={2} mt={1} direction="column">
              {/* Data */}
              <Grid item xs={12} display="flex" alignItems="baseline" gap={2}>
                <Typography fontSize={20}>📅</Typography>
                <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Typography variant="body1Bold">
                    Data:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(eventoDetails.data).toLocaleDateString()}
                  </Typography>
                </span>
              </Grid>

              {/* Posizione */}
              <Grid item xs={12} display="flex" alignItems="baseline" gap={2}>
                <Typography fontSize={20}>📍</Typography>
                <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                  <Typography variant="body1Bold">
                    Posizione:
                  </Typography>
                  <Typography variant="body1">
                    {eventoDetails.posizione || 'Non specificata'}
                  </Typography>
                </span>
              </Grid>

              {/* Orario */}
              <Grid item xs={12} display="flex" alignItems="baseline" gap={2}>
                <Typography fontSize={20}>🕒</Typography>
                <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Typography variant="body1Bold">
                    Ora:
                  </Typography>
                  <Typography variant="body1" >
                    {eventoDetails.Orario ? new Date('1970-01-01T' + eventoDetails.Orario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Non specificato'}
                  </Typography>
                </span>
              </Grid>
            </Grid>

            {eventoDetails.descrizione && (<Grid container spacing={2} alignItems="center" mt={1}>
              {/* Descrizione */}
              <Grid item xs={12} sm={6} display="flex" alignItems="center">
                <Typography variant="body1Bold">
                  Descrizione:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {eventoDetails.Descrizione}
                </Typography>
              </Grid>
            </Grid>)
            }
          </Box>
        </Box>

        <Divider sx={{ margin: 3 }} />

        {/* Punti di interesse */}
        <Typography variant="h2" sx={{ mt: 4 }}>
          Punti di Interesse dell'evento:
        </Typography>

        {eventoDetails && eventoDetails.pois && eventoDetails.pois.length > 0 ? (
          <Box mt={2}>
            {eventoDetails.pois.map((poi) => (
              <POICard
                key={poi.idPOI}
                nome={poi.nome}
                descrizione={poi.descrizione}
                marker={`${STRAPI_API_URL}${poi?.Marker.url}` || null}
                longitudine={poi.Longitudine}
                latitudine={poi.Latitudine}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Nessun punto di interesse disponibile.
          </Typography>
        )}

        <Divider sx={{ margin: 3 }} />

        <Typography variant="h2" sx={{ mt: 4 }}>
          Hai da dirci qualcosa sull'evento?
        </Typography>

        {feedbackDetails ? (
          <Typography variant="body1" >
            Hai già inviato un feedback per questo evento.
          </Typography>
        )
          : (
            oggi >= eventoDetails?.data ? (
              <>
                <Button
                  variant="contained"
                  onClick={handleFeedbackClick}
                  sx={{
                    borderRadius: 20,
                    mt: 2,
                    mb: 4,
                    backgroundColor: '#408eb5',
                    '&:hover': {
                      backgroundColor: '#ed96c8', // Colore per lo stato hover
                    },
                  }}
                >
                  Lascia un feedback
                </Button>

                {showForm && (
                  <Box mt={2}>
                    <Typography variant="body1Bold">
                      Scrivi il tuo feedback
                    </Typography>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Inserisci qui il tuo feedback..."
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSubmitFeedback}
                      sx={{
                        mt: 2,
                        mb: 4,
                        backgroundColor: '#EA580C',
                        '&:hover': { backgroundColor: '#D1550A' },
                      }}
                    >
                      Invia
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Torna dopo l'evento per farci sapere che ne pensi!
              </Typography>
            )
          )
        }
      </Container>
    </ThemeProvider>
  );
}

const getColoriChip = (tipo) => {
  switch (tipo?.trim().toLowerCase()) {
    case 'concerto':
      return { backgroundColor: '#4caf50', }; // Verde
    case 'sfilata':
      return { backgroundColor: '#2196f3', }; // Blu
    case 'convivialità':
      return { backgroundColor: '#ff9800', }; // Arancione
    case 'presentazione':
      return { backgroundColor: 'orange', }; // Arancione
    default:
      return { backgroundColor: 'gray', }; // Default
  }
};

