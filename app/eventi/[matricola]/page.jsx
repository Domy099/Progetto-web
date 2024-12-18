"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box, Button } from '@mui/material';
import jwt from 'jsonwebtoken';
import MultiLineInput from '../../components/MultiLineInput';

import { use } from 'react';

export default function EventoDetailPage ({ params }) {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_POI_API_URL;
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
  
      const response = await fetch("${STRAPI_API_URL}/api/feedbacks", {
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
      {/* Titolo dell'evento */}
      <Typography variant="h4" component="h1" gutterBottom>
        {eventoDetails.nome}
      </Typography>
  
      <Typography variant="h6" gutterBottom>
        Descrizione:
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {eventoDetails.Descrizione} {/* Descrizione dell'evento */}
      </Typography>
  
      <Typography variant="body2" color="text.secondary"></Typography>
      <Typography variant="body2" color="text.secondary">
        Data: {new Date(eventoDetails.data).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Tipo: {eventoDetails.tipo}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Posizione: {eventoDetails.posizione || 'Non specificata'}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Punti di Interesse dell'evento:
      </Typography>
  
      {eventoDetails && eventoDetails.pois && eventoDetails.pois.length > 0 ? (
        <Box mt={4}>
          {eventoDetails.pois.map((poi) => (
            <Card key={poi.idPOI} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{poi.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {poi.descrizione}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Nessun punto di interesse disponibile.
        </Typography>
      )}

      {/* Confronta la data odierna con quella dell'evento per verificare che si possa lasciare un feedback */}
      
      {oggi >= eventoDetails?.data  && (
        <>
        
      <Button
        variant="contained"
        color="primary"
        onClick={handleFeedbackClick}
        sx={{ mt: 2 }} // Aggiungi un margine superiore se necessario
      >
        Lascia un feedback
      </Button>

      {showForm && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Scrivi il tuo feedback
          </Typography>
          <MultiLineInput
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Inserisci qui il tuo feedback..."
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmitFeedback}
            sx={{ mt: 2 }}
          >
            Invia
          </Button>
          </Box>
          )}
      </>
      )
    }
    </Container>
  );
} 

