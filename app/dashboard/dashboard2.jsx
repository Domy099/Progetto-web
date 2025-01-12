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
import Link from "next/link";
import TicketCard from "../components/Biglietto/TicketCard";
import FeedbackCard from "../components/FeedbackCard";
import { color } from "framer-motion";

// Import per la scansione della camera
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function DashboardNuova() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [matricola, setMatricola] = useState("");
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [userVoto, setUserVoto] = useState(null);

  // mosta nasconti lo scanner
  const [showScanner, setShowScanner] = useState(false);

  // Gestione lettura da scanner
  const handleScan = async (error, result) => {
    if (result) {
      setMatricola(result.text);
      setShowScanner(false);
    }
    if (error) {
      console.error("Errore durante la scansione:", error);
    }
  };

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
          `${STRAPI_API_URL}/api/users/me?populate[feedbacks]=*&populate[bigliettis][populate]=evento&populate[voto][populate]=carri`,
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
        setUserVoto(userData.voto);
        console.log("Voto:", userVoto);
        // setUserFeedbacks(userData.feedbacks);
        //console.log(userFeedbacks);
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
          userRelation: ticket.user || null /*NOTE - Per evitare errori*/,
        }));

        setAllTickets(formattedTickets);
      } catch (error) {
        console.error("Errore nel recupero dei biglietti:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();

    Promise.all([fetchUserData(), fetchAllTickets(), fetchFeedbacks()]).catch(
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, [router]);

  const fetchFeedbacks = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${STRAPI_API_URL}/api/users/me?populate[feedbacks][populate]=evento`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Errore nel recupero dei feedback: ${response.status}`);
      }

      const responseData = await response.json();

      // Verifica la struttura della risposta
      if (!responseData.feedbacks || !Array.isArray(responseData.feedbacks)) {
        throw new Error("Formato risposta non valido");
      }

      console.log("Feedback fetchati:", responseData.feedbacks);

      // Mappa i dati dei feedback nel formato richiesto
      const formattedFeedbacks = responseData.feedbacks.map((feedback) => ({
        id: feedback.documentId, // Usa il campo corretto dal JSON
        evento: feedback.evento?.nome || "Evento sconosciuto",
        descrizione: feedback.descrizione || "Nessuna descrizione disponibile",
      }));

      setUserFeedbacks(formattedFeedbacks);
    } catch (error) {
      console.error("Errore nel recupero dei feedback:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Biglietti aggiornati:", userTickets);
  }, [userTickets]);

  useEffect(() => {
    console.log("Feedback aggiornati:", userFeedbacks);
  }, [userFeedbacks]);

  useEffect(() => {
    console.log("Voto aggiornato:", userVoto);
  }, [userVoto]);

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
      const matricolaInt = parseInt(matricola, 10);
      if (isNaN(matricolaInt)) {
        alert("Matricola non valida. Inserire un numero.");
        return;
      }

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
        <Typography variant="h6" sx={{ color: "black" }}>
          Il tuo carro preferito:{" "}
          {userVoto ? (
            userVoto.carri.nome
          ) : (
            <>
              Nessun carro preferito?{" "}
              <Link
                href={`/carri`}
                passHref
                style={{ textDecoration: "none", color: "#d9622a" }}
              >
                Corri a votare!
              </Link>
            </>
          )}
        </Typography>
      </Box>

      {/* Sezione per aggiungere un biglietto */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Inserisci Matricola"
          variant="outlined"
          value={matricola}
          onChange={(e) => setMatricola(e.target.value)}
          sx={{ mb: 2, width: "100%" }}
        />
        {/* Area per l'aggiunta dei biglietti */}
        <Box sx={{ display: "flex", justifyContent: "left", mb: 3 }}>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            variant="contained"
            onClick={() => setShowScanner(!showScanner)}
            sx={{ mr: 2 }}
          >
            {showScanner ? "Chiudi Scanner" : "Scansiona Codice"}
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            variant="contained"
            onClick={handleAddTicket}
          >
            Aggiungi Biglietto
          </Button>
        </Box>

        {showScanner && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => handleScan(err, result)}
            />
          </div>
        )}
      </Box>

      {/*Area che mostra i biglietti*/}
      <Box sx={{ mb: 3, p: 2 }}>
        {" "}
        {/* Aggiunto padding */}
        <Typography variant="h6" sx={{ color: "black" }} marginBottom={2}>
          I tuoi biglietti:
        </Typography>
        {userTickets.length > 0 ? (
          <Grid
            container
            spacing={2} // Ridotto spacing
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              "& .MuiGrid-item": {
                pl: 2, // Ridotto padding
                pr: 2, // Ridotto padding
              },
            }}
          >
            {userTickets
              .filter(
                (ticket, index, self) =>
                  index === self.findIndex((t) => t.codice === ticket.codice)
              )
              .map((ticket) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6} // Modificato da 4 a 6
                  lg={4} // Modificato da 3 a 4
                  key={ticket.codice}
                  sx={{
                    mb: 2, // Ridotto margin bottom
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TicketCard
                    nomeEvento={ticket.evento?.nome}
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

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: "black" }} marginBottom={2}>
          I tuoi Feedback:
        </Typography>
        {userFeedbacks.length > 0 ? (
          <Grid container spacing={3}>
            {userFeedbacks.map((feedback) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={feedback.id}>
                <FeedbackCard
                  nomeEvento={feedback.evento}
                  descrizioneFeedback={feedback.descrizione}
                  documentId={feedback.id}
                  onFeedbackDeleted={fetchFeedbacks}
                  onFeedbackUpdated={fetchFeedbacks}
                  token={sessionStorage.getItem("token")}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ color: "black" }}>
            Nessun feedback disponibile
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        {/* Logout Button */}
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

        {/* Reset Password Button */}
        <Button
          variant="contained"
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => {
            sessionStorage.removeItem("token");
            router.push("/reset-password");
          }}
        >
          Reset Password
        </Button>
      </Box>
    </Container>
  );
}
