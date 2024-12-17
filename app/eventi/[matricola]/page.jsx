"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CardMedia, Box, Button } from '@mui/material';
import jwt from 'jsonwebtoken';
import MultiLineInput from '../../components/MultiLineInput';

import { use } from 'react';

export default function EventoDetailPage ({ params }) {
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


  useEffect(() => {
    if (!matricola) return;

    const fetchEventoDetails = async () => {
      try {
        const response = await fetch(
          `https://strapiweb.duckdns.org/api/eventi?filters[matricola][$eq]=${matricola}&populate=pois`
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
  }, [matricola]);

  // FETCH DATI DEI VOTI PER VERIFICARE SE L'UTENTE HA GIA' VOTATO
    //useEffect(() => {
      const fetchFeedback = async () => {
        try {
          // Recupera il token dell'utente dal sessionStorage
          const token = sessionStorage.getItem('token');
          if (!token) {
            console.error("Utente non autenticato!");
            alert("Devi effettuare l'accesso per inviare un feedback");
            router.push("/login");
            return;
          }
  
          // Decodifica il token per ottenere l'ID dell'utente
          const decoded = jwt.decode(token);
          if (!decoded || !decoded.id) {
            console.error("Token non valido o ID utente non presente!");
            alert("Errore durante l'autenticazione, accedi nuovamente.");
            router.push("/login");
            return;
          }
  
          const idUtente = decoded.id;
          setIdUtente(idUtente);
          console.log('ID utente:', idUtente);
  
          // Imposta lo stato di caricamento
          setLoading(true);
  
          // Esegui la chiamata API con il token incluso nei headers
          const response = await fetch(`https://strapiweb.duckdns.org/api/feedbacks?filters[visitatore][$eq]=${idUtente}&filters[evento][$eq]=${idEvento}`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Include il token
              'Content-Type': 'application/json', // Specifica il tipo di contenuto
            },
          });
  
          if (!response.ok) {
            throw new Error('Errore nella risposta della API');
          }
  
          // Ottieni i dati dei voti
          const voti = await response.json();
  
          // Controlla se l'utente ha già votato
          const hasVoted = voti.data && voti.data.length > 0;
          setHasVoted(hasVoted);

          setFeedbackDetails(hasVoted ? voti.data[0] : null); // Se ha votato, salva i dettagli del voto
          console.log('Dati dei feedback:', feedbackDetails);
          console.log('Votato:', hasVoted);
          
          hasVoted && setShowForm(false); // Nascondi il form se l'utente ha già votato
          setLoading(false);

        } catch (error) {
          console.error('Errore nel recuperare i feedback utente:', error);
          setLoading(false);
        }
      };

      //fetchFeedback();
    //}, [idEvento]);

  //Gestisce l'invio del feedback
  const handleFeedbackClick = async () => {
    // Verifica se l'utente ha già votato
    fetchFeedback();

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Devi effettuare l'accesso per inviare un feedback");
      console.error("Utente non autenticato!");
      router.push("/login");
      return;
    }
    
    if (hasVoted) {
      setShowForm(false); // Nascondi il form se l'utente ha già votato
      alert("Hai già inviato un feedback per questo evento");
      return;
    }
    setShowForm(true); // Mostra il form per inviare il feedback
  };

  const handleSubmitFeedback = async () => {
    
    // Se è autenticato, ottieni il suo id dal token tramite 
    const token = sessionStorage.getItem("token");
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    setIdUtente(userId);
    console.log('ID utente per il voto:', idUtente);
    setLoading(true);
    console.log('Matricola evento:', matricola);
    try {
      // Prepara i dati del voto
      const votoData = {
        data: {
          evento: { id: idEvento },  // ID del carro votato
          visitatore: { id: idUtente }, // ID dell'utente che sta votando
          descrizione: feedbackText, // Descrizione del feedback
        },
      };

      // Invia la richiesta POST per registrare il voto
      const response = await fetch("https://strapiweb.duckdns.org/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Aggiungi il token nell'intestazione
        },
        body: JSON.stringify(votoData),
      });

      if (!response.ok) {
        throw new Error("Errore nel registrare il feedback");
      }

      const responseData = await response.json();
      console.log("Feedback registrato con successo", responseData);

      // Imposta lo stato per mostrare che l'utente ha votato
      setHasVoted(true);
      setShowForm(false); // Nascondi il form dopo aver inviato il feedback
      alert("Grazie per aver inviato il feedback!");
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }

    

    if (loading) {
      return <Typography>Caricamento in corso...</Typography>; // Mostra il messaggio di caricamento
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
    </Container>
  );
} 

