"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Card, CardContent, CardMedia, Box, Button, Grid } from "@mui/material";
import BottoneIndietro from "@/app/components/IndietroButton";
import jwt from "jsonwebtoken";
import ArtigianoCard from "@/app/components/ArtigianoCard";
import Link from "next/link";
import LeggiDiPiu from "@/app/components/LeggiDiPiu";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from "@/public/theme";

export default function CarroDetailPage({ params }) {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const router = useRouter();
  const { idCarro } = React.use(params);

  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [carroDetails, setCarroDetails] = useState(null);
  const [error, setError] = useState(null);
  const oggi = new Date();
  //const [idUtente, setIdUtente] = useState(null);
  const [VotiDetails, setVotiDetails] = useState(null);
  const [idCarroVoto, setIdCarroVoto] = useState(null);

  // FETCH DATI DEL CARRO
  useEffect(() => {
    if (!idCarro) return;

    const fetchCarroDetails = async () => {
      try {
        const response = await fetch(
          `${STRAPI_API_URL}/api/carri?filters[idCarro][$eq]=${idCarro}&populate[0]=immagine&populate[1]=artigiani.immagine`
        );
        const data = await response.json();
        setCarroDetails(data.data[0]);
        console.log("Dettagli del carro:", data.data[0]);
        setIdCarroVoto(data.data[0].id);

        setLoading(false);
      } catch (error) {
        console.error("Errore nel recuperare i dati del carro", error);
        setLoading(false);
      }
    };

    const fetchVoti = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          //alert("Devi effettuare l'accesso per inviare un voto");
          //router.push("/login");
          //return hasVoted;
          console.log("Utente non autenticato!");
          return;
        }

        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) {
          alert("Errore durante l'autenticazione, accedi nuovamente.");
          router.push("/login");
          //return hasVoted;
        }

        //const idUtente = decoded.id;
        //setIdUtente(idUtente);

        setLoading(true);
        const response = await fetch(
          `${STRAPI_API_URL}/api/users/me?populate[voto][populate]=carri`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Errore nel recupero dei voti: ${response.status}`
          );
        }

        const responseData = await response.json();

        // Verifica la struttura della risposta
        /*if (!responseData.voto) {
          throw new Error("Non ci sono voti nella risposta");
        }
        */

        console.log("Voti fetchati:", responseData.voto);
        if (responseData.voto ) {
          if(responseData.voto.length > 0)
          {
            setHasVoted(true);
          }
        }

        // Mappa i dati dei voti nel formato richiesto
        /*const formattedVoti = {
          id: responseData.voto.id, // Usa il campo id del voto
          carro: responseData.voto.carri?.idCarro || "Evento sconosciuto",
        };
        */

        setVotiDetails(responseData.voto);
        return hasVoted;
      } catch (error) {
        console.error("Errore nel recupero dei voti:", error);
        setError(error.message);
        return hasVoted;
      } finally {
        setLoading(false);
      }
    };


    //fetchCarroDetails();

    Promise.all([fetchCarroDetails(), fetchVoti()]).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [idCarro, hasVoted]);

  useEffect(() => {
    console.log("Voti aggiornati:", VotiDetails);
  }, [VotiDetails]);

  const handleVotaClick = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Devi effettuare l'accesso per votare.");
      router.push("/login");
      return;
    }

    const decoded = jwt.decode(token);
    const userId = decoded.id;
    //setIdUtente(userId);

    /*const { hasVoted } = await fetchVoti();

    if (hasVoted) {
      alert("Hai già votato per un carro.");
      return;
    }
    */
    setLoading(true);
    try {
      const votoData = {
        data: {
          carri: { id: idCarroVoto },
          votante: { id: userId },
        },
      };

      const response = await fetch(`${STRAPI_API_URL}/api/voti`, {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Container>
      <BottoneIndietro destinazione="/carri" />
      <Container>
        {/* Contenuto dell'evento */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }} // Cambia da una colonna a due colonne
          alignItems="flex-start"
          gap={4}
          mt={4}
        >
          {/* Immagine del carro a sinistra */}
          <Box
            flexShrink={0}
            sx={{
              maxWidth: { xs: "100%", sm: "40%" }, // Larghezza dinamica per immagine
            }}
          >
            <img

              src={carroDetails.immagine?.url ? `${STRAPI_API_URL}${carroDetails.immagine.url}` : `https://placehold.co/150?text=${carroDetails.nome}`}
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

          {/* Dettagli del carro a destra */}
          <Box flex={1}>
            <Typography variant="h1" component="h1" gutterBottom color="text.secondary">
              {carroDetails.nome}
            </Typography>
            <Typography variant="h2" gutterBottom color="text.secondary">
              Descrizione:
            </Typography>
            <LeggiDiPiu text={carroDetails.descrizione} lunghezza={600} />
            {VotiDetails ? (
              VotiDetails?.carri?.idCarro == idCarro ? (
                <>
                  <Button
                    variant="disabled"
                    sx={{
                      mt: 2,
                      backgroundColor: '#D3D3D3',
                      borderRadius: '20px',
                    }}
                  >
                    Vota
                  </Button>
                  <Typography variant="body1" color="text.secondary" marginTop={2}>
                    Hai già votato per questo carro.
                  </Typography>
                </>
              ) : (
                <>
                  <Button
                    variant="disabled"
                    sx={{
                      mt: 2,
                      backgroundColor: '#D3D3D3',
                      borderRadius: '20px',
                    }}
                  >
                    Vota
                  </Button>
                  <Typography variant="body1" color="text.secondary" marginTop={2}>
                    Hai già votato per un altro carro.
                  </Typography>
                </>
              )
            ) : (
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: '#408eb5',
                  '&:hover': { backgroundColor: '#ed96c8' },
                  borderRadius: '20px',
                }}
                onClick={handleVotaClick}
                
              >
                Vota
              </Button>
            )}


          </Box>
        </Box>
      </Container>


      {/* Sezione Artigiani sotto i dettagli */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h2" sx={{ marginTop: 3, marginBottom: 2 }}>
          Realizzato da:
        </Typography>

        {/* Grid container per gestire il layout a griglia */}
        {carroDetails.artigiani.length > 0 ? (
          <Container>
            <Grid container spacing={4} sx={{justifyContent: 'flex-start'}} columnGap={4}>
            {carroDetails.artigiani.map((artigiano) => (
              <Grid
                key={artigiano.idArtigiano}
                item
                xs={10}   // Una colonna su schermi molto piccoli
                sm={6}    // Due colonne su schermi medi
                md={4}    // Tre colonne su schermi grandi
              >
                <Link href={`/artigiani/${artigiano.idArtigiano}`} passHref>
                  <ArtigianoCard
                    nome={artigiano.nome}
                    cognome={artigiano.cognome}
                    storia={artigiano.storia}
                    immagine={artigiano.immagine?.url ?
                      `${STRAPI_API_URL}${artigiano.immagine.url}`
                      : 'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'}
                  />
                </Link>
              </Grid>
             
            ))}
          </Grid>
          </Container>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Nessuna informazione sugli artigiani.
          </Typography>
        )}
      </Container>

    </Container>
    </ThemeProvider>
  );

}