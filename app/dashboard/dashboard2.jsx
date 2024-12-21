import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  TextField,
} from "@mui/material";
import TicketCard from "../components/Biglietto/TicketCard";

export default function DashboardNuova() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [matricola, setMatricola] = useState("");

  /* SECTION - Effetto per il caricamento iniziale */
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/users/me?populate=*`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Impossibile recuperare i dati utente");
        }

        const userData = await response.json();
        setUser(userData);
        setUserTickets(userData.bigliettis || []);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAllTickets = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/biglietti?filters[user][$null]=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Errore nel recupero dei biglietti: ${response.status}`
          );
        }

        const responseData = await response.json();
        if (!Array.isArray(responseData.data)) {
          throw new Error("Formato risposta non valido");
        }

        const formattedTickets = responseData.data.map((ticket) => ({
          id: ticket.documentId,
          matricola: ticket.codice,
          userRelation: ticket.user || null, /*NOTE - Per evitare errori*/
        }));

        setAllTickets(formattedTickets);
      } catch (error) {
        console.error("Errore nel recupero dei biglietti:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchUserData(), fetchAllTickets()]).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [router]);

  /* SECTION - Funzione per assegnare il biglietto */
  const handleSendTicket = async (ticket) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Utente non autenticato!");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${STRAPI_API_URL}/api/biglietti/${ticket.ticketId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              user: { id: ticket.userId },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento del biglietto");
      }

      await response.json();
      console.log("Biglietto aggiornato con successo");

      // Ricarica la pagina
      window.location.reload();
    } catch (error) {
      console.error("Errore durante l'assegnazione del biglietto:", error);
      alert("Errore durante l'assegnazione del biglietto");
    } finally {
      setLoading(false);
    }
  };

  /* SECTION - Funzione per aggiungere un biglietto */
  const handleAddTicket = async () => {
    try {
      // Verifica che la matricola sia valida
      /*REVIEW - Se non dovesse funzionare, riusa per convertire la matricola in intero*/
      const matricolaInt = parseInt(matricola, 10);
      if (isNaN(matricolaInt)) {
        alert("Matricola non valida. Inserire un numero.");
        return;
      }
      console.log('All ticket', allTickets);
      // Cerca il biglietto con la matricola inserita
      const foundTicket = allTickets.find(
        (ticket) => ticket.matricola === matricolaInt
      );
      if (!foundTicket) {
        alert("Biglietto non valido o già utilizzato.");
        return;
      }

      // Decodifica il token per ottenere l'ID dell'utente
      const token = sessionStorage.getItem("token");
      const decoded = jwt.decode(token);
      const userId = decoded.id;

      // Assegna il biglietto
      await handleSendTicket({ ticketId: foundTicket.id, userId });
    } catch (error) {
      console.error("Errore nella validazione del biglietto:", error);
    }
  };

  /* SECTION - Funzione logout */
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <Typography>Caricamento in corso...</Typography>;
  if (error) return <Typography>Errore: {error}</Typography>;
  if (!user) return null;

  return (
    <Container sx={{ padding: 4 }}>
      {/* Sezione di benvenuto */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "left",
            mb: 2,
            color: "black",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Bentornato, {user.username}!
        </Typography>
      </Box>

      {/* Sezione per aggiungere un biglietto */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Aggiungi Biglietto:
        </Typography>
        <TextField
          label="Inserisci Matricola"
          variant="outlined"
          value={matricola}
          onChange={(e) => setMatricola(e.target.value)}
          sx={{ mb: 2, width: "100%" }}
        />
        <Button
          className="bg-orange-600 hover:bg-orange-700"
          variant="contained"
          onClick={handleAddTicket}
        >
          Aggiungi Biglietto
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
  <Typography variant="h6">I tuoi Biglietti:</Typography>
  {userTickets.length > 0 ? (
    <Grid container spacing={20}> {/* Ridotto lo spacing a 2 */}
      {userTickets
        .filter((ticket, index, self) =>
          // Filtra solo il primo biglietto con un codice unico
          index === self.findIndex(t => t.codice === ticket.codice)
        )
        .map(ticket => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={ticket.codice}> {/* Modificato per avere 1 colonna su mobile, 2 su tablet, 3 su desktop e 4 su large */}
            {/* Utilizza il componente Ticket per ogni biglietto */}
            <TicketCard
              dataEmissione={ticket.createdAt}
              codice={ticket.codice}
            />
          </Grid>
        ))}
    </Grid>
  ) : (
    <p>Nessun biglietto disponibile</p>
  )}
</Box>




      {/* Logout Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => {
            sessionStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </Box>
      
    </Container>
  );
}
