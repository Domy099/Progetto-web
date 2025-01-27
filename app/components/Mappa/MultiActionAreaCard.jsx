import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Link from "next/link";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../../../public/theme"; // Importa il tema personalizzato
import { Description } from "@mui/icons-material";

// Funzione per determinare i colori dei chip in base al tipo di evento
const getColoriChip = (tipo) => {
  switch (tipo?.trim().toLowerCase()) {
    case "concerto":
      return { backgroundColor: "#4caf50", color: "white" };
    case "sfilata":
      return { backgroundColor: "#2196f3", color: "white" };
    case "convivialità":
      return { backgroundColor: "#ff9800", color: "white" };
    case "presentazione":
      return { backgroundColor: "#ff5722", color: "white" };
    default:
      return { backgroundColor: "#9e9e9e", color: "white" };
  }
};

const MultiActionAreaCard = ({
  title,
  image,
  altText,
  position,
  date,
  hour,
  eventCode,
  tipo,
  description,
}) => {
  const [address, setAddress] = useState(""); // Stato per memorizzare l'indirizzo
  const [loading, setLoading] = useState(false); // Stato per gestire il caricamento
  const [error, setError] = useState(null); // Stato per gestire gli errori
  const { lat, lng } = position || {}; // Estrae latitudine e longitudine dalla posizione

  // useEffect per recuperare l'indirizzo quando lat e lng cambiano
  useEffect(() => {
    const fetchAddress = async () => {
      if (!lat || !lng) return; // Se lat o lng non sono presenti, esce dalla funzione

      setLoading(true);
      try {
        // Effettua una richiesta all'API di Google Maps per ottenere l'indirizzo
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );

        if (!response.ok) throw new Error("Errore di rete");

        const data = await response.json();

        if (data.status === "OK") {
          setAddress(data.results[0].formatted_address); // Imposta l'indirizzo se la risposta è OK
        } else {
          throw new Error(data.error_message || "Indirizzo non trovato");
        }
      } catch (err) {
        setError(err.message); // Imposta l'errore nello stato
      } finally {
        setLoading(false); // Imposta lo stato di caricamento su false
      }
    };

    fetchAddress(); // Chiama la funzione per recuperare l'indirizzo
  }, [lat, lng]); // Esegui l'effetto solo quando lat o lng cambiano

  const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`; // Crea il link per avviare la  navigazione su Google Maps

  return (
    <ThemeProvider theme={theme}>
      {/* Card principale */}
      <Card
        sx={{
          maxWidth: 345,
          borderRadius: 2,
          boxShadow: 3,
          cursor: eventCode ? "pointer" : "auto", // Cambia il cursore se c'è un eventCode
        }}
      >
        {eventCode ? (
          // Card cliccabile per eventi
          <Link href={`/eventi/${eventCode}`} passHref>
            <CardActionArea sx={{ display: "flex", flexDirection: "column" }}>
              {/* Immagine dell'evento */}
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={altText}
                sx={{
                  borderRadius: "10px 10px 0 0",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
              {/* Contenuto della Card */}
              <CardContent sx={{ width: "100%" }}>
                {/* Chip per il tipo di evento */}
                <Chip
                  label={tipo}
                  sx={{
                    ...getColoriChip(tipo),
                    mb: 2,
                    fontSize: "0.75rem",
                    fontFamily: "KaioSuper, Arial, Helvetica, sans-serif",
                  }}
                />
                {/* Titolo dell'evento */}
                <Typography gutterBottom variant="h1" component="div">
                  {title}
                </Typography>
                {/* Data e ora dell'evento */}
                <Box
                  sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {date ? "📅 " + new Date(date).toLocaleDateString() : " "}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {hour
                      ? "🕒 " +
                        new Date(`1970-01-01T${hour}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : " "}
                  </Typography>
                </Box>
                {/* indicatore di caricamento se l'indirizzo è in fase di recupero, */}
                {loading && <CircularProgress size={20} />}
                {/* Mostra un messaggio di errore se si verifica un errore */}
                {error && (
                  <Typography variant="body1" color="error">
                    ⚠️ {error}
                  </Typography>
                )}
                {/* Mostra l'indirizzo se disponibile */}
                {address && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    📍 {address}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Link>
        ) : (
          // Card non interagibile per POI
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardMedia
              component="img"
              height="200"
              image={image}
              alt={altText}
              sx={{
                borderRadius: "10px 10px 0 0",
                objectFit: "cover",
                width: "100%",
              }}
            />
            <CardContent sx={{ width: "100%" }}>
              <Chip
                label={tipo}
                sx={{
                  ...getColoriChip(tipo),
                  mb: 2,
                  fontSize: "0.75rem",
                  fontFamily: "KaioSuper, Arial, Helvetica, sans-serif",
                }}
              />
              <Typography gutterBottom variant="h1" component="div">
                {title}
              </Typography>
              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {description}
                </Typography>
              </Box>
              {loading && <CircularProgress size={20} />}
              {error && (
                <Typography variant="body2" color="error">
                  ⚠️ {error}
                </Typography>
              )}
              {address && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  📍 {address}
                </Typography>
              )}
            </CardContent>
          </Box>
        )}

        {/* Azioni della Card (pulsante per aprire Google Maps) */}
        <CardActions sx={{ padding: 2 }}>
          <Link href={googleMapsLink} passHref legacyBehavior>
            <Button
              size="small"
              variant="contained"
              sx={{
                backgroundColor: "var(--azzurro)",
                "&:hover": { backgroundColor: "var(--rosa)" },
                textTransform: "none",
                borderRadius: "10px",
              }}
            >
              Apri Mappe
            </Button>
          </Link>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
};

export default MultiActionAreaCard;
