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
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import TicketCard from "../components/Biglietto/TicketCard";
import FeedbackCard from "../components/FeedbackCard";
import { color } from "framer-motion";

// Import per la scansione della camera
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import DashboardMenu from "../components/dashboardMenu";
import theme from "../../public/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SelectorMenu from "../components/SelectorMenu";

export default function Dashboard() {
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
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const [openDialog, setOpenDialog] = useState(false); // Stato per la visibilità del dialog

  const handleOpenDialog = () => {
    setOpenDialog(true); // Mostra il dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Nascondi il dialog
  };

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

  const [activeSection, setActiveSection] = useState('Biglietti');

  const handleSectionSelect = (section) => {
    setActiveSection(section);
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

  /*
  useEffect(() => {
    console.log("Feedback aggiornati:", userFeedbacks);
  }, [userFeedbacks]);

  useEffect(() => {
    console.log("Voto aggiornato:", userVoto);
  }, [userVoto]);
  */

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

  const handleBlockUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${STRAPI_API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          disattivato: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore durante il blocco dell'utente");
      }
      console.log("Utente bloccato con successo");
      // Reindirizza alla pagina principale dopo il blocco
      sessionStorage.removeItem("token");
      router.push("/");
    } catch (error) {
      console.error("Errore:", error);
      setError(error.message);
    }
  };

  if (loading) return <Typography>Caricamento in corso...</Typography>;
  if (error) return <Typography>Errore: {error}</Typography>;
  if (!user) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ padding: 4 }}>
        <Container>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h1" align="center" sx={{ marginTop: 4 }}>
              Bentornato, {user.username}!
            </Typography>
            <Typography variant="body1" align="center">
              🎭 Grazie per aver vissuto con noi la magia del Carnevale di
              Putignano! 🎉
            </Typography>
          </Box>
        </Container>

        <Container style={{ marginBottom: "5px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Divider
              sx={{
                borderRadius: "20px",
                marginTop: "20px",
                width: "60%",
                marginBottom: "20px",
              }}
            />
          </Box>
        </Container>

        {/* Container per centrare il menu */}
        <Container style={{ marginBottom: "5px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <SelectorMenu 
              options={['Biglietti', 'Feedback', 'Gestione Profilo']}
              defaultSelected='Biglietti'
              onSelect={handleSectionSelect}
            />
          </Box>
        </Container>

        
        {activeSection === "Biglietti" && (
          <Box sx={{ mb: 3 }}>
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
                      index ===
                      self.findIndex((t) => t.codice === ticket.codice)
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
                        id={ticket.evento?.documentId}
                      />
                    </Grid>
                  ))}
              </Grid>
            ) : (
              <p>Nessun biglietto disponibile</p>
            )}
            <Button
              variant="contained"
              onClick={() => setIsOverlayOpen(!isOverlayOpen)}
              sx={{
                backgroundColor: "#408eb5", // Colore personalizzato
                "&:hover": {
                  backgroundColor: "#ed96c8", // Colore per l'hover
                },
              }}
            >
              Aggiungi Biglietto
            </Button>
            {/* Sezione per aggiungere un biglietto */}
            {isOverlayOpen && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: 3,
                    borderRadius: 2,
                    width: "80%",
                    maxWidth: "500px",
                    boxShadow: 3,
                    position: "relative",
                  }}
                >
                  <Button
                    onClick={() => setIsOverlayOpen(false)}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 20,
                      minWidth: "auto",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      padding: 0,
                      color: "white",
                      backgroundColor: "#408eb5", // Colore personalizzato
                      "&:hover": {
                        backgroundColor: "#ed96c8", // Colore per l'hover
                      },
                    }}
                  >
                    ✕
                  </Button>

                  <Typography variant="h6" sx={{ color: "black", mb: 2 }}>
                    Aggiungi un biglietto
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "grey", mb: 2, marginTop: 1 }}
                  >
                    Aggiungi i tuoi biglietti al portafoglio per recuperarli in
                    qualsiasi momento.
                  </Typography>
                  <TextField
                    label="Inserisci Matricola"
                    variant="outlined"
                    value={matricola}
                    onChange={(e) => setMatricola(e.target.value)}
                    sx={{ mb: 2, width: "100%" }}
                  />
                  {/* Area per l'aggiunta dei biglietti */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => setShowScanner(!showScanner)}
                      sx={{
                        mr: 2,
                        backgroundColor: "#408eb5", // Colore personalizzato
                        "&:hover": {
                          backgroundColor: "#ed96c8", // Colore per l'hover
                        },
                      }}
                    >
                      {showScanner ? "Chiudi Scanner" : "Scansiona Codice"}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleAddTicket}
                      sx={{
                        backgroundColor: "#408eb5", // Colore personalizzato
                        "&:hover": {
                          backgroundColor: "#ed96c8", // Colore per l'hover
                        },
                      }}
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
              </Box>
            )}
          </Box>
        )}

{activeSection === "Feedback" && (
  <Box sx={{ mb: 3, p: 3,  borderRadius: 2 }}>
    {/* Carro preferito */}
    <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: 3 }}>
      <Icon
        sx={{
          color: "red",
          mr: 1,
          fontSize: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FavoriteIcon />
      </Icon>
      <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
        Il tuo carro preferito:{" "}
        {userVoto ? (
          <span style={{ color: "red" }}>{userVoto.carri.nome}</span>
        ) : (
          <>
            Nessun carro preferito?{" "}
            <Link
              href={`/carri`}
              passHref
              style={{ textDecoration: "none", color: "#d9622a", fontWeight: "bold" }}
            >
              Corri a votare!
            </Link>
          </>
        )}
      </Typography>
    </Box>
    
    <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
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
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography sx={{ color: "#666", fontStyle: "italic" }}>
        Nessun feedback disponibile
      </Typography>
    )}
  </Box>
)}

        {activeSection === "Gestione Profilo" && (
          <Box sx={{ mt: 3, p: 3, borderRadius: 2 }}>
            {/* Titolo della sezione */}
            <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold", mb: 3 }}>
              Gestione Profilo
            </Typography>

            {/* Sezione Azioni di Sicurezza */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
                Azioni di Sicurezza
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
                Qui puoi gestire le impostazioni di sicurezza del tuo account.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Logout Button */}
                <Button
                  variant="contained"
                  onClick={() => {
                    sessionStorage.removeItem("token");
                    router.push("/login");
                  }}
                  sx={{
                    backgroundColor: "#408eb5",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 2,
                    boxShadow: 2,
                    "&:hover": {
                      backgroundColor: "#ed96c8",
                      boxShadow: 4,
                    },
                  }}
                >
                  Logout
                </Button>

                {/* Reset Password Button */}
                <Button
                  variant="contained"
                  onClick={() => {
                    sessionStorage.removeItem("token");
                    router.push("/reset-password");
                  }}
                  sx={{
                    backgroundColor: "#408eb5",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 2,
                    boxShadow: 2,
                    "&:hover": {
                      backgroundColor: "#ed96c8",
                      boxShadow: 4,
                    },
                  }}
                >
                  Reset Password
                </Button>
              </Box>
            </Box>

            {/* Sezione Cancellazione Account */}
            <Box>
              <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
                Cancellazione Account
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
                Attenzione: questa azione è irreversibile. Una volta cancellato, il tuo account e tutti i dati associati verranno eliminati definitivamente.
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenDialog}
                sx={{
                  backgroundColor: "#408eb5",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: 2,
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: "#ed96c8",
                    boxShadow: 4,
                  },
                }}
              >
                Cancella Utente
              </Button>
            </Box>

            {/* Dialog di conferma cancellazione */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Conferma cancellazione</DialogTitle>
              <DialogContent>
                Sei sicuro di voler cancellare il profilo? Questa azione non può
                essere annullata.
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Annulla
                </Button>
                <Button onClick={handleBlockUser} color="error">
                  Conferma
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
